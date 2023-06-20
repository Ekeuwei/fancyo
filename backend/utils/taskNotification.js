const got = require('got')
const WhatAppTempId = require("../models/whatAppTempId");

const sendWhatsAppMessage = async (waId, workerId, task) =>{

    const whatsAppTempId = await WhatAppTempId.create({
      taskId:task._id, workerId, waId
    })
    
    const message = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": `${whatsAppTempId.waId}`,
      "type": "interactive",
      "interactive": {
          "type": "button",
          "header": {
              "type": "text",
              "text": "TASK ALERT!!!"
          },
          "body": {
              "text": `${task.summary}. \n\nNOTE: to accept this task, your account will be debited ₦100 service fee.\n`
          },
          "footer": {
              "text": `Location: ${task.location.town}`
          },
          "action": {
              "buttons": [
                  {
                      "type": "reply",
                      "reply": {
                          "id": `${whatsAppTempId._id}+1`,
                          "title": "Yes"
                      }
                  },
                  {
                      "type": "reply",
                      "reply": {
                          "id": `${whatsAppTempId._id}+2`,
                          "title": "No"
                      }
                  }
              ]
          }
      }
    }

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
      },
      json: message,
      responseType: 'json'
    };

    try {
      const phoneNumberId = '114237478363942';
      await got.post(`https://graph.facebook.com/v12.0/${phoneNumberId}/messages`, options)
      
    } catch (error) {
      console.error(error.message)
    }

    return whatsAppTempId;
}

module.exports = sendWhatsAppMessage;