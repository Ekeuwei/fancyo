const got = require('got')
const WhatAppTempId = require("../models/whatAppTempId");

exports.sendWhatsAppMessage = async (waId, workerId, task) =>{

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
                        "id": `${whatsAppTempId._id}_1`,
                        "title": "Yes"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": `${whatsAppTempId._id}_2`,
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

exports.interactiveResponse = async (response, to) =>{
  let status;
  const payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `${to}`,
    "type": "text",
    "text": {
        "body": response.message
    }
  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    json: payload,
    responseType: 'json'
  };

  try {
    const phoneNumberId = '114237478363942';
    status = await got.post(`https://graph.facebook.com/v12.0/${phoneNumberId}/messages`, options)
    
  } catch (error) {
    console.error(error.message)
  }

  return status;
}

exports.whatsAppMessage = async (message, to) =>{
  let status;
  const payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": `${to}`,
    "type": "text",
    "text": {
        "body": message
    }
  }

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    json: payload,
    responseType: 'json'
  };

  try {
    const phoneNumberId = '114237478363942';
    status = await got.post(`https://graph.facebook.com/v12.0/${phoneNumberId}/messages`, options)
    
  } catch (error) {
    console.error(error.message)
  }

  return status;
}
