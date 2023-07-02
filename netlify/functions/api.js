// import express, { Router } from 'express';

import app from '../../backend/app';
import connectDatabase from '../../backend/config/database';
import { loginUser } from '../../backend/controllers/authController';
import { myTasks } from '../../backend/controllers/taskController';
import { isAuthenticatedUser } from '../../backend/midllewares/auth';

// import serverless from 'serverless-http';
const express = require('express');
const serverless = require('serverless-http')
const cloudinary = require('cloudinary')

const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')

// Connecting to database
connectDatabase();

// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const api = express();

api.use(express.json({limit: "50mb"}));
api.use(bodyparser.urlencoded({limit: "50mb", extended: true}))
api.use(cookieParser());
api.use(fileUpload());


const router = express.Router();
// router.get('/hello', (req, res) => res.send('Hello World!'));

router.route("/tasks").get(isAuthenticatedUser, myTasks);
router.route('/login').post(loginUser);

api.use('/api/v1/', router);

export const handler = serverless(api);