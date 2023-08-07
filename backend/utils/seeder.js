const Product = require("../models/product");
const Worker = require("../models/worker");
const Task = require("../models/task");
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

const updateAllTasksRates = async ()=> {
  try {
    
    const updateResult = await Task.updateMany({rate: { $exists: false }}, { $set: { rate: {value: 2000, agreed: false, postedBy: 'owner'} } });

    console.log(`Updated ${updateResult.matchedCount} tasks`);
  } catch (error) {
    console.error(error);
  } finally{
    process.exit();
  }
}

const updateAllTasksIds = async ()=> {
  try {

    const tasksToUpdate = await Task.find({ 
      $or: [
        { taskId: { $exists: false } }, // Check if the taskId field does not exist
        { taskId: { $not: { $type: 'number' } } } // Check if the taskId field is not a number
      ]
    });

    // Update taskId for each document in the array
    for (const task of tasksToUpdate) {
      const nextTaskId = await Task.generateNextTaskId();
      task.taskId = nextTaskId;
      await task.save();
    }

    console.log(`${tasksToUpdate.length} documents updated.`);

  } catch (error) {
    console.error(error);
  } finally{
    process.exit();
  }
}

const updateAllWorkerUniqueIds = async ()=> {
  try {

    const workersToUpdate = await Worker.find({ 
      $or: [
        { uniqueId: { $exists: false } }, // Check if the uniqueId field does not exist
        { uniqueId: { $not: { $type: 'number' } } } // Check if the uniqueId field is not a number
      ]
    });

    // Update uniqueId for each document in the array
    for (const worker of workersToUpdate) {
      const nextUniqueId = await Worker.generateNextUniqueId();
      worker.uniqueId = nextUniqueId;
      await worker.save();
    }

    console.log(`${workersToUpdate.length} documents updated.`);

  } catch (error) {
    console.error(error);
  } finally{
    process.exit();
  }
}

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

// updateAllWorkerUniqueIds();
// updateAllTasksIds();
// updateAllTasksRates();
// seedSettings();
// seedProduct();
