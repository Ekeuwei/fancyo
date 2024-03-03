const User = require("../models/user")
const { projectSuccessNotificationEmailTemplatePunter, projectFailureNotificationEmailTemplatePunter, projectSuccessNotificationEmailTemplateUser, projectFailureNotificationEmailTemplateUser } = require("./emailTemplates")
const sendEmail = require("./sendEmail")
const sendSMS = require("./sendSMS")

exports.ProjectCompletionNotification = async (details)=>{
    
    const lostContribution = details.profit + details.contributedAmount <= 1
    const isRoi = details.profit > 0
    
    const successTextContributor = `Project ${details.projectId} completed! Your ROI of ${(details.contributedAmount + details.profit)} has been credited. Check your wallet now!`
    const successTextPunter = `Project ${details.projectId} is done! Your earnings, ${details.commission}, have been credited. View details in your wallet.`
    const failureTextContributor = `Project ${details.projectId} concluded with no profit. ${lostContribution?'':(details.contributedAmount + details.profit)+' of your contribution has been returned.'} We appreciate your participation.`
    const failureTextPunter = `Project ${details.projectId} ended without profit. No commission is applicable. Thank you for your involvement.`
    
    const punterText = isRoi? successTextPunter:failureTextPunter
    const contributorText = isRoi? successTextContributor:failureTextContributor

    const punterEmailBody = isRoi? projectSuccessNotificationEmailTemplatePunter(details):projectFailureNotificationEmailTemplatePunter(details)
    const userEmailBody = isRoi? projectSuccessNotificationEmailTemplateUser(details):projectFailureNotificationEmailTemplateUser(details)

    const user = await User.findById(details.userId)
    if(user.role === 'punter'){
        if(user.preferences.getNotified.sms){
            sendSMS(punterText)
        }

        if(user.preferences.getNotified.email){
            // send email
            sendEmail({
                email: user.email,
                subject: `Project Completion and Punter Commission Notification`,
                message: punterEmailBody
            })
        }
    }
    else {
        if(user.preferences.getNotified.sms){
            sendSMS(contributorText)
        }

        if(user.preferences.getNotified.email){
            // send email
            sendEmail({
                email: user.email,
                subject: `Project Completion Notification`,
                message: userEmailBody
            })
        }
    }
}