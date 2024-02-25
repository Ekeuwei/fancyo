const Bank = require("../models/bank");

const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const banks = require("../data/banks.json");
const { connect } = require("mongoose");
const sendSMS = require("./sendSMS");

// Setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();


const seedBanks = async () => {
  try {
    await Bank.deleteMany();
    console.log("Banks deleted");

    await Bank.insertMany(banks);
    console.log("All banks are added");

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
};


// seedBanks();
