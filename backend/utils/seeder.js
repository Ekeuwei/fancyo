const Product = require("../models/product");
const State = require("../models/address/state");
const Lga = require("../models/address/lga");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const products = require("../data/product.json");
const states = require("../data/states.json");
const lgas = require("../data/lgas.json");
const { connect } = require("mongoose");

// Setting dotenv file
dotenv.config({ path: "backend/config/config.env" });

connectDatabase();

const seedSettings = async () => {
  try {
    await State.deleteMany();
    console.log("States deleted");

    await State.insertMany(states);
    console.log("All states are added");

    const uploadedStates = await State.find();

    const updatedLgas = lgas.map((lga) => {
      const state = uploadedStates.find((state) => state.name.toLowerCase() === lga.state.toLowerCase());
      lga.state = state._id;
      lga.name = lga.lga
      return lga;
    });

    await Lga.deleteMany();
    console.log("LGAs deleted");
    await Lga.insertMany(updatedLgas);
    console.log("All LGAs are added");

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
};

const seedProduct = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("All products are added");

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit();
  }
};

seedSettings();
// seedProduct();
