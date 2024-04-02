const express = require("express");

const router = express.Router();

const Task = require("../models/task");
const User = require("../models/user");

router.use(express.json());
/*
 * /user GET User Tasks by it's ID
 * /guild GET Guild Tasks by it's ID
 * /count GET Count of pending tasks
 * /:id PATCH Update Task status by it's ID
 * / POST Create a new Task
 * / DELETE Delete a Task by it's ID
 */

router.get("/user", async (req, res) => {
  if (!req.query["id"])
    return res.status(400).send({ error: "Missing required fields" });

  const data = await Task.find({
    userID: req.query["id"],
  });

  if (!data)
    return res.status(404).send({
      error: "User not found",
    });

  let newData = [];

  data.forEach((task) => {
    newData.push({
      id: task.id,
      task: task.task,
      date: task.date,
      guildID: task.guildID,
      userID: task.userID,
      status: task.status,
    });
  });

  if (newData.length === 0)
    return res
      .status(404)
      .send({ error: `No tasks found for ${req.query["id"]}` });

  res.send({ data: newData });
});

router.get("/guild", async (req, res) => {
  if (!req.query["id"])
    return res.status(400).send({ error: "Falta el campo requerido id" });

  try {
    const data = await Task.find({
      guildID: req.query["id"],
    });

    if (!data || data.length === 0)
      return res.status(404).send({
        error: `No se encontraron tareas para el guildID ${req.query["id"]}`,
      });

    let newData = [];

    data.forEach((task) => {
      newData.push({
        id: task.id,
        task: task.task,
        date: task.date,
        guildID: task.guildID,
        userID: task.userID,
        status: task.status,
      });
    });

    res.send({ data: newData });
  } catch (err) {
    res.status(500).send({ error: "Internal server error." });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Task.countDocuments({ status: false });

    res.send({ count: count });
  } catch (err) {
    res.status(500).send({ error: "Internal server error." });
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).send({ error: "Missing field: id" });
  if (!req.body["status"])
    return res.status(400).send({ error: "Missing field: status" });
  if (!(req.params.id && req.body["status"]))
    return res.status(400).send({ error: "Missing field: id, status" });
  try {
    const task = await Task.findOne({
      id: req.params.id,
      userID: req.body["userID"],
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    task.status = req.body["status"];
    await task.save();

    res.send({
      code: 200,
      message: "Task Updated for id: " + req.params.id,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/", async (req, res) => {
  if (
    !req.body["task"] ||
    !req.body["date"] ||
    !req.body["guildID"] ||
    !req.body["userID"]
  )
    return res.status(400).send({ error: "Missing required fields" });

  const task = new Task({
    task: req.body["task"],
    date: req.body["date"],
    guildID: req.body["guildID"],
    userID: req.body["userID"],
    status: req.body["status"],
  });

  let userInTable = await User.findOne({ userID: task.userID });
  if (!userInTable) {
    userInTable = new User({ userID: task.userID });
    try {
      await userInTable.save();
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  try {
    const savedTask = await task.save();
    userInTable.tasks.push(savedTask._id);
    await userInTable.save();
    res.send({ task: savedTask });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/", async (req, res) => {
  if (!req.body["id"] || !req.body["userID"])
    return res.status(400).send({ error: "Missing field: id, userID" });

  try {
    let user = await User.findOne({ userID: req.body["userID"] });
    if (!user) throw new Error("User not found");

    const task = await Task.findOne({
      id: req.body["id"],
      userID: req.body["userID"],
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    await Task.deleteOne({ _id: task._id });

    user.tasks.pull(task._id);
    await user.save();

    res.send({
      code: 200,
      message: "Task Deleted for id: " + req.body["id"],
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/", async (req, res) => {
  if (!req.body["id"])
    return res.status(400).send({ error: "Missing field: id" });

  try {
    const tasks = await Task.find({ id: req.body["id"] });
    if (!tasks || tasks.length === 0)
      return res.status(404).send({ error: "Task not found" });

    // Delete all the tasks that belong to the user who is making this request
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const user = await User.findOne({ userID: task.userID });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      user.tasks.pull(task._id);
      await user.save();
    }

    await Task.remove({ id: req.body["id"] });

    res.send({
      code: 200,
      message: `Deleted ${tasks.length} tasks with id: ${req.body["id"]}`,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
