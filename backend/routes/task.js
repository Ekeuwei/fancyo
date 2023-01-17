const express = require("express");
const router = express.Router();

const {
  newTask,
  myTasks,
  updateTask,
  myWorks,
} = require("../controllers/taskController");
const { isAuthenticatedUser } = require("../midllewares/auth");

router.route("/task/new").post(isAuthenticatedUser, newTask);
router.route("/tasks").get(isAuthenticatedUser, myTasks);
router.route("/works").get(isAuthenticatedUser, myWorks);
router.route("/task/:id").put(isAuthenticatedUser, updateTask);

module.exports = router;
