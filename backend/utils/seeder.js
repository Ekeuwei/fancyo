const Product = require("../models/product");
const Worker = require("../models/worker");
const User = require("../models/user");
const Task = require("../models/task");
const State = require("../models/address/state");
const Lga = require("../models/address/lga");
const Town = require("../models/address/town");

const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const workers = require("../data/workers.json");
const states = require("../data/states.json");
const lgas = require("../data/lgas.json");
const { connect } = require("mongoose");
const Wallet = require("../models/wallet");
const { getProperTitle } = require("../midllewares/chatgpt");
const { creditWallet } = require("../controllers/paymentController");
const sendSMS = require("./sendSMS");

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

const seedWorkers = async (lga)=> {
  try {

    for (const detail of workers){
      const { firstName, lastName, phoneNumber, town, landmark, description } = detail;
      
      console.log("User created",town);
      const value = Math.floor(Math.random()*100)+1
      const email = `${firstName}.${lastName}${value}@ebiwoni.com`.toLowerCase().replace(/\s/g, '')
      
      let newTown = await Town.findOne({name: town});

      console.log("User created");

      const category = await getProperTitle(description)
            
      if(!newTown){
          const newLga = await Lga.findById(lga)
          newTown = await Town.create({ 
            name: town.trim(),
            state: newLga.state,
            lga: newLga._id
          })
      }

      const contact = {
        address: landmark,
        town: newTown._id
      }

      const user = await User.create({
          firstName,
          lastName,
          phoneNumber,
          referralId: "1001",
          contact,
          email:email
      });
      console.log("User created");
      const wallet = await Wallet.create({ userId: user._id })
      user.walletId = wallet._id;
      console.log("Wallet created");
      
      const worker = await Worker.create({
          owner: user._id,
          description,
          location: {state: "06", lga: "118", town},
          category
      })
      console.log("Worker created");
      user.workers.push(worker._id)
      user.role = 'worker'
      user.userMode = !user.userMode
          
      // credit the newly created worker account with 500 bonus 
      creditWallet(500, "Complementary sign-up bonus", user._id);
      const message = `Hello ${user.firstName},\nyour ${worker.category.name} worker account is ready. Log in now at www.ebiwoni.com/register to update your rates and charges.`
      const to = `234${user.phoneNumber.slice(-10)}`
      sendSMS(message, to);

      await user.save({ validateStateBeforeSave: false });
    
    }

    console.log(workers.length, " workers created");

  } catch (error) {
    console.error(error);
  } finally{
    // process.exit();
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


seedWorkers("647744b387968b971280e06f")
// updateAllWorkerUniqueIds();
// updateAllTasksIds();
// updateAllTasksRates();
// seedSettings();
