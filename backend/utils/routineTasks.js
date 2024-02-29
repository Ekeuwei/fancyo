const { sporty } = require('./bookies');
const Ticket = require('../models/ticket');
const Project = require('../models/project');
const User = require('../models/user');
const { creditWallet } = require('../controllers/paymentController');
const logger = require('../config/logger')

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
    const tickets = await Ticket.find({ status: 'progress' });

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
    const projects = await Project.find({ endAt: { $lte: currentDate }, status: 'in progress' });
    const pendingProjects = await Project.find({ startAt: { $lte: currentDate }, status: 'pending' });

    const updatedRunningProjects = await Promise.all(projects.map(async (project) => {
      let tickets = await Ticket.find({ projectId: project._id });
      const isProjectInprogress = tickets.some(ticket => ticket.status === 'in progress');

      if (!isProjectInprogress) {
        const contributedAmount = project.contributors.reduce((amount, contributor) => amount + contributor.amount, 0);
        const projectCurrentBalance = tickets.reduce((prev, ticket) => {
          const totalOdds = ticket.games.reduce((odds, game) => odds * game.odds, 1);
          const outcome = ticket.status === 'success' ? (ticket.stakeAmount * totalOdds - ticket.stakeAmount) : -ticket.stakeAmount;
          return prev + outcome;
        }, contributedAmount);

        const profit = projectCurrentBalance - contributedAmount;
        const platformCommission = profit * 0.05; // 5%
        const punterCommission = profit * 0.2; // 20%
        const contributorsCommission = profit - platformCommission - punterCommission;

        // Settle contributors
        await Promise.all(project.contributors.map(async (contributor) => {
          if (contributor.status !== 'settled') {
            const investmentQuota = contributor.amount / contributedAmount;
            const contributorProfit = contributorsCommission * investmentQuota;
            contributor.status = 'settled';
            await project.save();
            await creditWallet((contributorProfit + contributor.amount), `Investment capital and returns. Project: ${project.uniqueId}`, contributor.userId);
            // TODO: Send notifications to user.
          }
        }));

        // Settle punter
        const punter = await User.findById(project.punter._id);
        await creditWallet(punterCommission, `Punter settlement. Project: ${project.uniqueId}`, project.punter._id);

        // Settle platform
        // await creditWallet(platformCommission, `Platform commission settlement. Project: ${project.uniqueId}`, 'platform purse');
      }

      return project.save();
    }));

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
