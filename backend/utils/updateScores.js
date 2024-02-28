const { sporty } = require('./bookies');
const Ticket = require('../models/ticket');

exports.updateTicketScores = async (ticket)=> {

    let liveScores

    switch (ticket.bookie) {
        case 'Sporty':
            liveScores = await sporty(ticket.ticketId)
            break;
    
        default:
            break;
    }


    // console.log(liveScores);

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

const updateTickets = async ()=>{
    const tickets = await Ticket.find({status: 'progress'})

     // Step 2: Manipulate the documents
    const updatedTickets = tickets.map(async (ticket) => {
      let newTicket = await updateTicketScores(ticket)
      return newTicket;
    });

    // Step 3: Save the updated documents to the database
    const savePromises = updatedTickets.map(ticket => ticket.save());

    // Wait for all save operations to complete
    await Promise.all(savePromises);
}