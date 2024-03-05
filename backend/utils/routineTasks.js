const { sporty } = require('./bookies');
const Ticket = require('../models/ticket');
const Project = require('../models/project');
const User = require('../models/user');
const { creditWallet } = require('../controllers/paymentController');
const logger = require('../config/logger');
const { ProjectCompletionNotification } = require('./notifications');
const Wallet = require('../models/wallet');

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
    const tickets = await Ticket.find({ status: 'in progress' });

    const updatedTickets = await Promise.all(tickets.map(async (ticket, idx) => {
      // Get updated ticket status
      const newTicket = await this.getTicketStatus(ticket);
      ticket.games = newTicket.games;

      // Update ticket status based on game outcomes
      const matchesConcluded = ticket.games.every(game => game.scores.ft !== '');
      const wonAllMatches = ticket.games.every(game => game.outcome === 1);
      ticket.status = matchesConcluded && wonAllMatches ? 'successful' :
        matchesConcluded && !wonAllMatches ? 'failed' : ticket.status;

      // Settlement for successful tickets
      if (ticket.status === 'successful') {
        const settlement = ticket.games.reduce((prev, current) => prev * (current.outcome === 1 ? current.odds : 1), ticket.stakeAmount);
        const project = await Project.findById(ticket.projectId);
        project.availableBalance += settlement;
        await project.save();
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
  const currentDate = new Date();

  try {
    const projects = await Project.find({ endAt: { $lte: currentDate }, status: 'in progress' })
                          .populate('punter', 'username')
                          .populate('contributors.user', 'username');

    const updatedRunningProjects = await Promise.all(projects.map(async (project) => {
      let tickets = await Ticket.find({ projectId: project._id });
      const isTicketInprogress = tickets.some(ticket => ticket.status === 'in progress');

      if (!isTicketInprogress) {

        const contributedAmount = project.contributors.reduce((amount, contributor) => amount + contributor.amount, 0);
        
        if(contributedAmount == 0){
          // no one contributed to this project
          project.status = 'no engagement'
          return project.save()
        }

        const projectCurrentBalance = tickets.reduce((prev, ticket) => {
          const totalOdds = ticket.games.reduce((odds, game) => odds * game.odds, 1);
          const outcome = ticket.status === 'successful' ? (ticket.stakeAmount * totalOdds - ticket.stakeAmount) : -ticket.stakeAmount;
          return prev + outcome;
        }, contributedAmount);

        const profit = projectCurrentBalance - contributedAmount;
        project.status = profit>0?'successful':'failed'
        
        const platformCommission = project.status==='successful'? profit * 0.05 : 0; // 5%
        const punterCommission = project.status==='successful'? profit * 0.2 : 0; // 20%
        const contributorsCommission = profit - platformCommission - punterCommission;
        
        // Settle contributors
        await Promise.all(project.contributors.map(async (contributor) => {
          if (contributor.status === 'pending') {
            const investmentQuota = contributor.amount / contributedAmount;
            const contributorProfit = contributorsCommission * investmentQuota;
            
            if(projectCurrentBalance >= 1){
              // At least 1 NGN remaining
              await creditWallet((contributorProfit + contributor.amount), `Investment capital and returns. Project: ${project.uniqueId}`, contributor.user._id);
              contributor.status = 'settled';

            }else{
              contributor.status = 'lost';
            }

            // Send notification contributor
            await ProjectCompletionNotification({
              username: contributor.user.username,
              userId: contributor.user._id,
              projectId: project.uniqueId,
              contributedAmount: contributor.amount,
              profit: contributorProfit,
            })

            await project.save();
          }
        }));
        
        // Settle punter
        await creditWallet(punterCommission, `Project commission. Project: ${project.uniqueId}`, project.punter._id);
        const wallet = await Wallet.findOne({userId: project.punter._id});

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

        // Settle platform
        // await creditWallet(platformCommission, `Platform commission settlement. Project: ${project.uniqueId}`, 'platform purse');
      }

      project.availableBalance = 0
      project.roi = profit

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
