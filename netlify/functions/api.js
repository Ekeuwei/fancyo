// import express, { Router } from 'express';

const serverless = require('serverless-http')
const cloudinary = require('cloudinary')

import app from '../../backend/app';
import connectDatabase from '../../backend/config/database';

// Connecting to database
connectDatabase();

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const handler = serverless(app);