const got = require('got');
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const Category = require('../models/settings/category');

exports.classify = catchAsyncErrors(async(req, res, next)=>{
    const sample1 = 'closest work category for: i need someone to ';
    const sample2 = 'Classify to closest niche category: i need someone to '
    const systemMsg = `you are a helpful assistant, you help to classify user 
                        input to their closest niche category. 
                        Think of the user looking for someone to perform some task for them. 
                        Only provide the category without any additional information`

    const systemMsgPersonified = `you are a helpful assistant, you help to classify user 
                        input to their closest niche category. 
                        Think of the user looking for someone to perform some task for them.
                        Only provide the personified category without any additional information`
    
    try {
        const response = await got.post('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            json: {
                model: 'gpt-3.5-turbo',
                messages: [{"content":systemMsgPersonified,"role": "system"},
                            {"role": "user", "content": req.body.description}],
                temperature: 0,
                max_tokens: 7
            }
        }).json();
        // console.log(response.choices[0].message.content);
        const title = (response.choices[0].message.content)
            .replace(/[\r\n]+/gm, " ")
            .replace(/\s+/g, " ")
            .replace(/\./g, "")
            .trim();
        if(title.includes("cannot")){
            return next(new ErrorHandler("Apologies, we are unable to assist with this request. Please try a different service or rephrase your request.", 404))
        }
        req.body.title = title;

        try {
            
            await Category.findOneAndUpdate({name: title}, 
                {name: title}, {new: true, upsert: true})

        } catch (error) {
            
        }

        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Internal server error', 500));
    }
})

exports.summarize = catchAsyncErrors(async(req, res, next)=>{
    const isRequest = req.body.numberOfWorkers !== undefined;
    const request = `The intention of the user is to find someone to perform 
                        a certain task, summarize what the user wants to get done. 
                        Your response should be as though its from the user and 
                        should prompt an action[${isRequest?'apply':'respond'}]. 
                        Limit your response to 15 words`
       
    try {
        const response = await got.post('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            json: {
                model: 'gpt-3.5-turbo',
                messages: [{"content":request,"role": "system"},
                            {"role": "user", "content": req.body.description}],
                temperature: 0,
                max_tokens: 15
            }
        }).json();
        // console.log(response.choices[0].message.content);
        const summary = (response.choices[0].message.content)
                        .replace(/[\r\n]+/gm, " ")
                        .replace(/\s+/g, " ").trim();
        if(summary.includes("I cannot")){
            return next(new ErrorHandler("Apologies, we are unable to assist with this request. Please try a different service or rephrase your request.", 404))
        }
        req.body.summary = summary;
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler('Internal server error', 500));
    }
})