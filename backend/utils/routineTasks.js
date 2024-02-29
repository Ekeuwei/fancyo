const { sporty } = require('./bookies');
const Ticket = require('../models/ticket');
const Project = require('../models/project');

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

exports.updateTicketProgress = async ()=>{
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

exports.updateProjectProgress = async()=>{
    const currentDate = new Date()
    const projects = await Project.find({endAt: { $lte: currentDate }, status: 'progress'})

    projects.forEach(async project =>{
        const projectTickets = await Ticket.find({projectId: project._id, status: { $ne: 'in progress' } })


    })

}