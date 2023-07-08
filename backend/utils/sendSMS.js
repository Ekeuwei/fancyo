const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (message, to)=>{
    let status;
    const from = process.env.SMS_SENDER_ID
    try {
        status = await client.messages.create({body: message, from, to});
        console.log('SMS sent: ',status.sid);
    } catch (error) {
        console.error(error.message)
    }

    return status;
}


module.exports = sendSMS;