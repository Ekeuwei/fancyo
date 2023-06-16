const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const Task = require("../models/task");
const WhatsAppTempId = require("../models/whatAppTempId");
const { debitWallet } = require("./paymentController");
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
        const whatsAppTempId = await WhatsAppTempId.findById(id.split('+')[0])

        if(!whatsAppTempId){

            // user has already supplied a response. Direct user to web platform
            // return from here

        }
        
        const task = await Task.findById(whatsAppTempId.taskId).populate({
            path: 'workers.worker',
            select: 'pricing',
            populate: {
            path: 'owner',
            select: 'firstName, lastName'
            }
        });

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

            
            
        }else{
            
            task.workers[workerIndex].escrow.worker = 'Declined';
            // Notify task requester that the worker is not available to perform the task,
            // Ask the requester to publish a task request for other workers in the neighbourhood to apply

        }


        // Delete the whatsApp Temporal Id
        await WhatsAppTempId.findByIdAndDelete(whatsAppTempId._id);
  

      }




      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }

})