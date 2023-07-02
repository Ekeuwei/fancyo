// import express, { Router } from 'express';

import app from '../../backend/app';
import connectDatabase from '../../backend/config/database';
import { myTasks } from '../../backend/controllers/taskController';
import { isAuthenticatedUser } from '../../backend/midllewares/auth';
import task from '../../backend/routes/task';

// import serverless from 'serverless-http';
const express = require('express');
const serverless = require('serverless-http')

// Connecting to database
connectDatabase();

// const api = express();

// const router = express.Router();
// router.get('/hello', (req, res) => res.send('Hello World!'));
// router.get('/tas', task)
// router.route("/tasks").get(isAuthenticatedUser, myTasks);

// api.use('/api/', router);

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};