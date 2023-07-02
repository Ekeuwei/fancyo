// import express, { Router } from 'express';

import { myTasks } from '../../backend/controllers/taskController';

// import serverless from 'serverless-http';
const express = require('express');
const serverless = require('serverless-http')

const api = express();

const router = express.Router();
router.get('/hello', (req, res) => res.send('Hello World!'));
router.get('/tasks', myTasks)

api.use('/api/', router);

export const handler = serverless(api);