const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");

router.use(express.json());

/**
 * Retrieves tasks based on the provided ID and type.
 * @param {string} id - The ID to search for.
 * @param {string} type - The type of task to search for.
 * @returns {Array} - An array of tasks matching the ID and type.
 * @throws {Error} - If no tasks are found.
 */
async function getTasks(id, type) {
  const tasks = await Task.find({ [`${type}ID`]: id });

  if (!tasks || tasks.length === 0) {
    throw new Error(`${type} not found`);
  }

  return tasks.map((task) => ({
    id: task.id,
    task: task.task,
    date: task.date,
    guildID: task.guildID,
    userID: task.userID,
    status: task.status,
  }));
}
// localhost:3000/tasks/user?id=123
router.get("/user", async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });
  }

  try {
    const data = await getTasks(id, "user");
    res.send({ data });
  } catch (err) {
    next(err);
  }
});

// localhost:3000/tasks/guild?id=123
router.get("/guild", async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });
  }

  try {
    const data = await getTasks(id, "guild");
    res.send({ data });
  } catch (err) {
    next(err);
  }
});

// localhost:3000/tasks/count
router.get("/count", async (_req, res) => {
  try {
    const count = await Task.countDocuments({ status: false });

    res.send({ count: count });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal server error." });
  }
});

// localhost:3000/tasks/123
router.put("/:id", async (req, res) => {
  if (!req.params.id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: id" });

  if (!req.body["status"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: status" });

  if (!(req.params.id && req.body["status"]))
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: id, status" });

  try {
    const task = await Task.findOne({
      id: req.params.id,
      userID: req.body["userID"],
    });
    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Task not found" });
    }

    task.status = req.body["status"];
    await task.save();

    res.send({
      code: StatusCodes.OK,
      message: "Task Updated for id: " + req.params.id,
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

// localhost:3000/tasks/123
/* 
  body: { 
    "task": "new task", 
    "date": "new date",
    "guildID": "new guildID",
    "userID": "new userID",
  }
  */
router.post("/", async (req, res) => {
  if (
    !req.body["task"] ||
    !req.body["date"] ||
    !req.body["guildID"] ||
    !req.body["userID"]
  )
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });

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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  try {
    const savedTask = await task.save();
    userInTable.tasks.push(savedTask._id);
    await userInTable.save();
    res.send({ task: savedTask });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});
// localhost:3000/tasks
/*
  body: {
    "id": "123",
    "userID": "123"
  }
 */
router.delete("/", async (req, res) => {
  if (!req.body["id"] || !req.body["userID"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: id, userID" });

  try {
    let user = await User.findOne({ userID: req.body["userID"] });
    if (!user) throw new Error("User not found");

    const task = await Task.findOne({
      id: req.body["id"],
      userID: req.body["userID"],
    });

    if (!task) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Task not found" });
    }

    await Task.deleteOne({ _id: task._id });

    user.tasks.pull(task._id);
    await user.save();

    res.send({
      code: StatusCodes.OK,
      message: "Task Deleted for id: " + req.body["id"],
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

// localhost:3000/tasks
/*
  body: {
    "id": "123"
  }
 */
router.delete("/", async (req, res) => {
  if (!req.body["id"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: id" });

  try {
    const tasks = await Task.find({ id: req.body["id"] });
    if (!tasks || tasks.length === 0)
      return res.status(404).send({ error: "Task not found" });

    for (let task of tasks) {
      const user = await User.findOne({ userID: task.userID });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send({ error: "User not found" });
      }
      user.tasks.pull(task._id);
      await user.save();
    }

    await Task.remove({ id: req.body["id"] });

    res.send({
      code: StatusCodes.OK,
      message: `Deleted ${tasks.length} tasks with id: ${req.body["id"]}`,
    });
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

router.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

module.exports = router;
