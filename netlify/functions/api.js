// import express, { Router } from 'express';

import { myTasks } from '../../backend/controllers/taskController';
import task from '../../backend/routes/task';

// import serverless from 'serverless-http';
const express = require('express');
const serverless = require('serverless-http')

const api = express();

const router = express.Router();
router.get('/hello', (req, res) => res.send('Hello World!'));
router.get('/tas', task)

api.use('/api/', router);

export const handler = serverless(api);