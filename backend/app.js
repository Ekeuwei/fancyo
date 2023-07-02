const express = require('express');
const serverless = require('serverless-http');

const app = express();

const cors = require('cors')

const cookieParser = require('cookie-parser')
const bodyparser = require('body-parser')
const fileUpload = require('express-fileupload')
// const dotenv = require('dotenv');
const path = require('path')

const errorMiddleware = require('./midllewares/errors');

// Enable CORS using the cors middleware
app.use(cors())

// Setting up config file
// dotenv.config({ path: 'backend/config/config.env' });
if(process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

app.use(express.json({limit: "50mb"}));
app.use(bodyparser.urlencoded({limit: "50mb", extended: true}))
app.use(cookieParser());
app.use(fileUpload());

//Import all routes 
const settings = require('./routes/settings');
const products = require('./routes/product');
const artisans = require('./routes/artisan');
const task = require('./routes/task');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');
const worker = require('./routes/worker')
const webhooks = require('./routes/webhooks')

app.use('/api/v1', settings);
app.use('/api/v1', products);
app.use('/api/v1', artisans);
app.use('/api/v1', task);
app.use('/api/v1', auth);
app.use('/api/v1', payment)
app.use('/api/v1', order)
app.use('/api/v1', worker)
app.use('/api/v1', webhooks)

if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// Middleware to handle errors
// app.use(errorMiddleware);

module.exports = app; 

// module.exports.handler = serverless(app);
