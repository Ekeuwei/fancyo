const { sporty, download, sportyBetting, upload } = require('./bookies');
const Ticket = require('../models/ticket');
const Project = require('../models/project');
const User = require('../models/user');
const { creditWallet } = require('../controllers/paymentController');
const logger = require('../config/logger');
const { ProjectCompletionNotification, ProjectNoEngagementNotification } = require('./notifications');
const Wallet = require('../models/wallet');
const dayjs = require('dayjs');

if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

const method = process.argv[2];

if (method === 'updateBettingTicket'){
  // return console.log(process.argv);
  
  updateBettingTicket(process.argv[3]);
}


exports.formatAmount = value => `₦${new Intl.NumberFormat('en-US').format(parseFloat(value.toString().replace(/[^\d.]/g, '')).toFixed(2))}`;

exports.getTicketStatus = async (ticket)=> {

    let liveScores

    switch (ticket.bookie) {
        case 'Sporty':
            liveScores = await sporty(ticket.ticketId)
            break;
    
        default:
            break;
    }

    const updatedGames = ticket.games.map(localGame => {
        let fixture = liveScores.find(liveGame => (/*localGame.time === liveGame.time &&*/ localGame.league === liveGame.league && localGame.homeTeam === liveGame.homeTeam && localGame.awayTeam===liveGame.awayTeam))

        if(fixture){
            localGame.scores = fixture.scores
            localGame.outcome = fixture.outcome
            localGame.matchStatus = fixture.matchStatus
            localGame.status = fixture.status
        }

        return localGame;
    })

    ticket.games = updatedGames

    return ticket;
}

exports.updateTicketProgress_ = async ()=>{
    const tickets = await Ticket.find({status: 'progress'})

    const updatedTickets = tickets.map(async (ticket, idx) => {

      let newTicket = await this.getTicketStatus(ticket)
      ticket.games = newTicket.games

      // Update status
      const matchesConcluded = ticket.games.every(game => game.scores.ft!=='')
      const wonAllMatches = ticket.games.every(game => game.outcome===1)
      ticket.status = matchesConcluded && wonAllMatches?'successful':
                      matchesConcluded && !wonAllMatches? 'failed': ticket.status
      
      if(ticket.status === 'successful'){
        const settlement = ticket.games.reduce((prev, current) => prev*(current.outcome===1?current.odds:1), ticket.stakeAmount)
        const project = await Project.findById(ticket.projectId)
        project.availableBalance += settlement
        await project.save()
      }

      console.log(`ticket ${idx+1} updated`);

      return ticket.save();
    });

    await Promise.all(updatedTickets);

    return `${tickets.length} tickets updated`

}

exports.updateTicketProgress = async () => {
  try {
    // const tickets = await Ticket.find({ status: 'in progress' });
    const tickets = await Ticket.find({ "games.scores.ft": '' });

    const updatedTickets = await Promise.all(tickets.map(async (ticket, idx) => {
      // Get updated ticket status
      const newTicket = await this.getTicketStatus(ticket);
      ticket.games = newTicket.games;

      if(ticket.status === 'in progress'){

        // Update ticket status based on game outcomes
        // const matchesConcluded = ticket.games.every(game => game.scores.ft !== '');
        const matchesConcluded = ticket.games.every(game => game.outcome != undefined);
        const wonAllMatches = ticket.games.every(game => game.outcome === 1);
        const lostAGame = ticket.games.some(game => game.outcome === 0);
        ticket.status = lostAGame ? 'failed' : matchesConcluded? 'successful' : ticket.status;
        // ticket.status = matchesConcluded && wonAllMatches ? 'successful' :
        //   (matchesConcluded && !wonAllMatches) || lostAGame ? 'failed' : ticket.status;
          
        if(ticket.status !== 'in progress'){
          
          // Settlement for successful tickets
          const project = await Project.findById(ticket.projectId);
          if (ticket.status === 'successful') {
            const settlement = ticket.games.reduce((prev, current) => prev * (current.outcome === 1 ? current.odds : 1), ticket.stakeAmount);
            project.availableBalance += settlement;
    
            project.stats.lossStreakCount = 0
            project.stats.highestBalance = Math.max(project.stats.highestBalance, project.availableBalance)
    
          }
          
          if(ticket.status === 'failed'){
            project.stats.lossStreakCount += 1
          }
          
          await project.save();
  
        }
        
      }


      console.log(`Ticket ${idx + 1} updated`);

      return ticket.save();
    }));

    return `${tickets.length} tickets updated`;
  } catch (error) {
    logger.error('Error in updateTicketProgress:', error);
    throw error; // Propagate the error if necessary
  }
};

exports.updateProjectProgress = async () => {
  const sevenDaysFromNow = new Date().setDate(new Date().getDate() + 7)
  const currentDate = new Date();
  
  try {
    const projects = await Project.find({ endAt: { $lte: sevenDaysFromNow }, status: 'in progress' })
                          .populate('punter', 'username')
                          .populate('contributors.user', 'username')
                          .select('+punterSettlement');

    const updatedRunningProjects = await Promise.all(projects.map(async (project) => {
      let tickets = await Ticket.find({ projectId: project._id });
      const isTicketInprogress = tickets.some(ticket => ticket.status === 'in progress');
      
      const supposedEndDate = new Date(`${project.endAt}`);
      supposedEndDate.setDate(supposedEndDate.getDate() - project.progressiveStaking? project.progressiveSteps : 0);

      const projectRoundingUp = new Date() > supposedEndDate &&
        // Last ticket was successfull or failed or progressiveStaking not applied
        (project.stats.lossStreakCount=== 0 || project.stats.lossStreakCount > project.progressiveSteps)

      if (!isTicketInprogress && projectRoundingUp) {

        const contributedAmount = project.contributors.reduce((amount, contributor) => amount + contributor.amount, 0);
        let projectStatus = project.status

        if(tickets.length === 0){
          // Either no value was contributed or punter did not submit ticket
          projectStatus = 'no engagement'
          project.availableBalance = 0

          if(project.contributors.length > 0){
            // Refund contributed amount
            await Promise.all(project.contributors.map(async (contributor) => {
              if (contributor.status !== 'settled') {

                await creditWallet(contributor.amount, `Investment capital and returns. Project: ${project.uniqueId}`, contributor.user._id);
                contributor.status = 'settled';

                try {
                  
                  // Send notification to contributor about refund
                  await ProjectNoEngagementNotification({
                    username: contributor.user.username,
                    userId: contributor.user._id,
                    projectId: project.uniqueId,
                    contributedAmount: contributor.amount,
                  })
                  
                } catch (error) {
                  logger.error(error)
                }

                await project.save();
              }
            }));
          }

          try {
            
            // Send No engagement notification to punter
            await ProjectNoEngagementNotification({
              username: project.punter.username,
              userId: project.punter._id,
              projectId: project.uniqueId,
              contributedAmount,
            })
            
          } catch (error) {
            logger.error(error)
          }

          project.status = projectStatus

          return project.save()
        }

        const projectCurrentBalance = tickets.reduce((prev, ticket) => {
          // Total odds only calculate odds where the outcome was a success
          const totalOdds = ticket.games.reduce((odds, game) => odds * (game.outcome==1? game.odds : 1), 1);
          const outcome = ticket.status === 'successful' ? (ticket.stakeAmount * totalOdds - ticket.stakeAmount) : -ticket.stakeAmount;
          return prev + outcome;
        }, contributedAmount);

        const profit = projectCurrentBalance - contributedAmount;
        projectStatus = profit>0?'successful':'failed'
        
        const platformCommission = projectStatus==='successful'? profit * 0.1 : 0; // 10%
        const punterCommission = projectStatus==='successful'? profit * 0.2 : 0; // 20%
        const contributorsCommission = profit - platformCommission - punterCommission;
        const contributorsCommissionRiskFree = profit * 0.2;

        
        // Settle contributors
        await Promise.all(project.contributors.map(async (contributor) => {
          if (contributor.status !== 'settled') {
            const investmentQuota = contributor.amount / contributedAmount;
            const contributorProfit = (contributor.riskFreeContribution? contributorsCommissionRiskFree : contributorsCommission) * investmentQuota;
            
            const onePercentContributedAmount = contributedAmount * 0.01
            if(projectCurrentBalance >= onePercentContributedAmount || onePercentContributedAmount >= 100){
              // At least 1% or N100 of contributed amount is remaining
              await creditWallet((contributorProfit + contributor.amount), `Investment capital and returns. Project: ${project.uniqueId}`, contributor.user._id);
              contributor.status = 'settled';

              if(contributor.riskFreeContribution){
                // Credit insurance wallet if it was a risk free contribution

              }

            }else{
              if(contributor.riskFreeContribution){
                // Debit insurance wallet if it was a risk free contribution
                
                // Refund user thier contribution
                
              }
              contributor.status = 'settled';
            }

            try {
              
              // Send notification contributor
              await ProjectCompletionNotification({
                username: contributor.user.username,
                userId: contributor.user._id,
                projectId: project.uniqueId,
                contributedAmount: contributor.amount,
                profit: contributorProfit,
              })

            } catch (error) {
              logger.error(error)
            }

            await project.save();
          }
        }));
        
        // Settle punter
        if(project.punterSettlement !== 'completed'){
          await creditWallet(punterCommission, `Project commission. Project: ${project.uniqueId}`, project.punter._id);
        
          project.status = projectStatus
          project.availableBalance = 0
          project.roi = profit
          project.punterSettlement = 'completed'
      
          await project.save();
        }
        
        const wallet = await Wallet.findOne({userId: project.punter._id});

        try {
          
          // Send notification to punter
          await ProjectCompletionNotification({
            username: project.punter.username,
            userId: project.punter._id,
            projectId: project.uniqueId,
            commission: punterCommission,
            profit,
            contributedAmount,
            walletBalance: wallet.balance,
          })
          
        } catch (error) {
          logger.error(error)
        }

        // Settle platform
        // await creditWallet(platformCommission, `Platform commission settlement. Project: ${project.uniqueId}`, 'platform purse');
        
      }


      return project.save();
    }));

    // Update pending projects to 'in progress' when startAt is reached
    const pendingProjects = await Project.find({ startAt: { $lte: currentDate }, status: 'pending' });
    const updatedPendingProjects = await Promise.all(pendingProjects.map(async (project) => {
      project.status = 'in progress';
      return project.save();
    }));

    return `${updatedRunningProjects.length} running projects and ${updatedPendingProjects.length} pending projects updated`;
  } catch (error) {
    logger.error(error);
    throw error; // Propagate the error if necessary
  }
};

async function updateBettingTicket(requestDate='today'){

  const downloadDirectory = 'https://bettingtips.rveasy.net/dailybettingtips/';
  const uploadDirectory = '/public_html/bettingtips/dailybettingtips';
  
  try {
        
        let {url_date, month } = getUrlDateAndMonth()

        if(requestDate === 'today'){
            // requestDat = 'MMYYYY
            url_date = getUrlDateAndMonth(requestDate).url_date
            month = getUrlDateAndMonth(requestDate).month
        }else{
            // requestDate = 'today'
        }

        // requestDate = 'today'|'YYYYMMDD'
        const tickets = await download('tickets', downloadDirectory);
        const tips = await download(requestDate==='today'?'today':month, downloadDirectory);
        
        if(!tickets[requestDate]){
          return console.log(`Tips for ${url_date} not found`);
        }
        
        const {freeTicket, vipTicket, date} = tickets[requestDate]
        const freePicks = await sportyBetting(freeTicket, 'free');
        const vipPicks = await sportyBetting(vipTicket, 'vip');

        games = [...freePicks, ...vipPicks]

        const updatedGames = tips.map(match => {
            const found = games.find(
                m =>
                m.date === match.date &&
                m.home === match.home &&
                m.away === match.away
            );
            return found ? { ...match, score: found.score } : match;
        });
            
        // perform upload to betting page
        await upload(updatedGames, requestDate==='today'?'today':month, uploadDirectory)

        
        // console.log(updatedGames);
        console.log(`Tips for ${requestDate} has been uploaded to ${requestDate==='today'?'today':month}`);

    } catch (error) {
        console.log(error);
    }
}

function getUrlDateAndMonth(argDate){

    let baseDate;

    if (argDate) {
        const parsed = dayjs(argDate, 'YYYY-MM-DD', true); // true = strict parsing
        if (parsed.isValid()) {
            baseDate = parsed;
        }
    }

    if (!baseDate) {
        const now = dayjs();
        // if current time is 10 p.m. or later, use tomorrow
        baseDate = now.hour() >= 22 ? now.add(1, 'day') : now;
    }

    const url_date = baseDate.format('YYYY-MM-DD');

    const previousMonth = baseDate.date() === 1
        ? baseDate.subtract(2, 'month')
        : baseDate.subtract(1, 'month');
  
    const month = previousMonth.format('YYYY-MM');
        
    return { url_date, month };
    
}