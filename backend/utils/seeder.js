const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/product.json')
const { connect } = require('mongoose');
const product = require('../models/product');

// Setting dotenv file
dotenv.config( { path: 'backend/config/config.env' } );

connectDatabase();

const seedProduct = async ()=>{
    try{
        await Product.deleteMany();
        console.log('Products deleted');

        await Product.insertMany(products)
        console.log('All products are added');
       
        process.exit();
    } catch (error){
        console.error(error.message);
        process.exit();
    }
}

seedProduct();