const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const Reminder = require("../models/reminder");

router.use(express.json());

/**
 * Retrieves items for a specific user.
 *
 * @param {string} id - The ID of the user.
 * @param {Object} model - The model used to query the database.
 * @returns {Promise<Array>} - A promise that resolves to an array of items.
 * @throws {Error} - If items are not found.
 */
async function getUserItems(id, model) {
  const items = await model.find({ userID: id });

  if (!items || items.length === 0) {
    throw new Error("Items not found");
  }

  return items;
}

/**
 * Retrieves a user by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved successfully.
 */
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findOne({ userID: req.params.id });
    if (!user) return res.sendStatus(StatusCodes.NOT_FOUND);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// localhost:3000/users
router.get("/", async (_req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// localhost:3000/users/123
router.get("/:id", getUser, (_req, res) => {
  res.json(res.user);
});

// localhost:3000/users/count
router.get("/count", async (_req, res, next) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// localhost:3000/users/123/reminders
router.get("/:id/reminders/", getUser, async (req, res, next) => {
  try {
    const reminders = await getUserItems(req.params.id, Reminder);
    res.json(reminders);
  } catch (err) {
    next(err);
  }
});

// localhost:3000/users/123/tasks
router.get("/:id/tasks/", getUser, async (req, res, next) => {
  try {
    const tasks = await getUserItems(req.params.id, Task);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

module.exports = router;
