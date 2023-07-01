const cloudinary = require('cloudinary')
const serverless = require('serverless-http');
const app = require('../../backend/app');
const connectDatabase = require('../../backend/config/database')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

connectDatabase();

module.exports.handler = serverless(app);