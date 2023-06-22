const got = require('got');
const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const Task = require("../models/task");
const WhatsAppTempId = require("../models/whatAppTempId");
const { debitWallet } = require("./paymentController");
const { sendWhatsAppMessage, interactiveResponse, whatsAppMessage } = require('../utils/taskNotification');
const token = process.env.WHATSAPP_TOKEN;
// Accepts POST requests at /webhook endpoint

exports.whatsApp = catchAsyncErrors(async (req, res, next)=>{

    // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      
      // Check if it is an interactive button reply
      const { type, interactive } = req.body.entry[0].changes[0].value.messages[0];
      if(interactive?.type === 'button_reply'){
        const { id, title } = interactive.button_reply;
        // Get the whatsApp task
        const whatsAppTempId = await WhatsAppTempId.findById(id.split('_')[0])

        if(!whatsAppTempId){

            // user has already supplied a response. Direct user to web platform
            // return from here

        }
        
        const task = await Task.findById(whatsAppTempId.taskId).populate({
            path: 'workers.worker',
            select: 'pricing',
            populate: {
            path: 'owner',
            select: 'firstName, lastName phoneNumber'
            }
        }).populate({
          path: 'location.lga',
          select: 'name',
          populate: {
            path: 'state',
            select: 'name'
          }
        }).populate('user', 'firstName lastName phoneNumber', User);

        let workerIndex = task.workers.findIndex(workersObj => workersObj._id.equals(whatsAppTempId.workerId))
  
            
        const debitWorker = task.workers[workerIndex].escrow.worker === 'Pending' && req.body.status === 'Accepted'
            
        const platformCommission = task.budget? 
            parseFloat(task.budget * 0.1) : 
            parseFloat(task.workers[workerIndex].worker.pricing.minRate * 0.1)

        if(title === 'yes'){
            
            // Check if worker wallet balance has enough to debit commission
            await debitWallet(platformCommission, 'Work request comm', req.user._id);
            
            task.workers[workerIndex].escrow.worker = 'Accepted';
            // Respond back with the task requester's contact details

            // send user contacts details
            const response = {
              title: `${task.title} Needed`,
              contact: `Alfred Ekeuwei\n Contact: 08030572700\n`,
              footer: 'Edepie, Yenagoa',
              message: 'I want to deliver an item for me'
            }
            const simpleMessage = `Mr. ${task.user.firstName} needs your ${task.title} skills.\n
                                    Contact Number:${task.user.phoneNumber}\n
                                    location:${task.location.name}, ${task.location.lga.name}, ${task.location.lga.state.name}\n
                                    Prescription: ${task.summary}`
            
            // Send the users contact;
            console.log('Task contact: ', task.contact);
            await whatsAppMessage(simpleMessage, from)

            
            
        }else{
            
            task.workers[workerIndex].escrow.worker = 'Declined';
            // Notify task requester that the worker is not available to perform the task,
            // Ask the requester to publish a task request for other workers in the neighbourhood to apply

        }


        // Delete the whatsApp Temporal Id
        // await WhatsAppTempId.findByIdAndDelete(whatsAppTempId._id);
  

      }

      got.post(`https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`, {
        json:{
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        responseType: 'json'
      })
      
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }

})

exports.whatsAppVerify = ((req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


const interactiveReply = {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "106336799163414",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550690648",
              "phone_number_id": "114237478363942"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Alfred Ekeuwei"
                },
                "wa_id": "2348030572700"
              }
            ],
            "messages": [
              {
                "context": {
                  "from": "15550690648",
                  "id": "wamid.HBgNMjM0ODAzMDU3MjcwMBUCABEYEjBCQ0FDMkVGQUVGMjJBRTJERAA="
                },
                "from": "2348030572700",
                "id": "wamid.HBgNMjM0ODAzMDU3MjcwMBUCABIYIEIzQ0FGRkJGQTBCQkI1Q0FGODkyMEUzM0JDOTk4MEFDAA==",
                "timestamp": "1687363362",
                "type": "interactive",
                "interactive": {
                  "type": "button_reply",
                  "button_reply": {
                    "id": "6491e024c9576e6bf986ad81+1",
                    "title": "Yes"
                  }
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}