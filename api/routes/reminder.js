const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");
const Reminder = require("../models/reminder");
router.use(express.json());

/**
 * / GET Reminders by the User ID
 * / POST Create a new Reminder for a specific user
 * / DELETE Delete a Reminder by it's ID
 */

router.get("/", async (req, res) => {
  try {
    if (!req.query["userID"]) {
      const reminders = await Reminder.find();
      return res.json(reminders);
    }

    const user = await User.findOne({
      userID: req.query["userID"],
    });

    if (!user) return res.status(404).send({ error: "User not found" });

    const data = await Reminder.find({
      userID: user.userID,
    });

    if (!data)
      return res.status(404).send({
        error: "Reminder not found for userID: " + req.query["userID"],
      });

    let newData = [];

    data.forEach((reminder) => {
      newData.push({
        reminderID: reminder.reminderID,
        hour: reminder.hour,
        minute: reminder.minute,
        timesPerDay: reminder.timesPerDay,
      });
    });

    if (newData.length === 0)
      return res.status(404).send({
        code: 404,
        error: `No reminders found for ${req.query["userID"]}`,
      });

    res.send({ data: newData });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  if (!req.body["userID"] || !req.body["hour"] || !req.body["minute"])
    return res.status(400).send({ error: "Missing required fields" });

  const user = await User.findOne({ userID: req.body["userID"] });

  if (!user) {
    return res.status(443).send({ error: "User not found" });
  }
  const data = new Reminder({
    userID: user.userID,
    hour: req.body["hour"],
    minute: req.body["minute"],
  });

  try {
    await data.save();
    user.reminders.push(data._id);
    res.send({
      code: 200,
      message: "Reminder Saved for userID: " + req.body["userID"],
    });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/", async (req, res) => {
  if (!req.body["id"] || !req.body["userID"])
    return res
      .status(400)
      .send({ error: "Missing required fields id, userID" });

  let user = await User.findOne({ userID: req.body["userID"] });
  if (!user) return res.status(404).send({ error: "User not found" });

  let reminderFound = await Reminder.findOne({ reminderID: req.body["id"] });
  if (!reminderFound)
    return res.status(404).send({ error: "Reminder not found" });

  let reminderToDelete = user.reminders.find(
    (reminder) => reminder._id.toString() == reminderFound._id.toString()
  );
  console.log(reminderToDelete, user.reminders, reminderFound._id);
  if (!reminderToDelete)
    return res.status(404).send({ error: "Reminder not found" });

  user.reminders = user.reminders.filter(
    (reminder) => reminder.reminderID != req.body["id"]
  );
  await user.save();

  await Reminder.deleteOne({ reminderID: req.body["id"], userID: user.userID });

  res.json({ message: "Recordatorio eliminado" });
});

module.exports = router;
