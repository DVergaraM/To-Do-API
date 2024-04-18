const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const User = require("../models/user");
const Reminder = require("../models/reminder");

router.use(express.json());

// localhost:3000/reminders
router.get("/", async (req, res, next) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      const reminders = await Reminder.find();
      return res.json(reminders);
    }

    const user = await User.findOne({ userID });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "User not found" });
    }

    const data = await Reminder.find({ userID: user.userID });

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `Reminder not found for userID: ${userID}` });
    }

    let newData = data.map((reminder) => ({
      reminderID: reminder.reminderID,
      hour: reminder.hour,
      minute: reminder.minute,
      timesPerDay: reminder.timesPerDay,
    }));

    if (newData.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `No reminders found for ${userID}` });
    }

    res.send({ data: newData });
  } catch (err) {
    next(err);
  }
});
// localhost:3000/reminders
/*
body : {
  "userID": "123",
  "hour": "12",
  "minute": "30"
}
*/
router.post("/", async (req, res, next) => {
  const { userID, hour, minute } = req.body;

  if (!userID || !hour || !minute) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });
  }

  const user = await User.findOne({ userID });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: "User not found" });
  }

  const data = new Reminder({
    userID: user.userID,
    hour,
    minute,
  });

  try {
    await data.save();
    user.reminders.push(data._id);
    await user.save();

    res.send({
      code: StatusCodes.OK,
      message: `Reminder Saved for userID: ${userID}`,
    });
  } catch (err) {
    next(err);
  }
});

// localhost:3000/reminders/
/*
body : {
  "id": "123",
  "userID": "123"
}
*/
router.delete("/", async (req, res, _next) => {
  const { id, userID } = req.body;

  if (!id || !userID) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields id, userID" });
  }

  let user = await User.findOne({ userID });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: "User not found" });
  }

  let reminderFound = await Reminder.findOne({ reminderID: id });
  if (!reminderFound) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ error: "Reminder not found" });
  }

  user.reminders = user.reminders.filter(
    (reminder) => reminder.reminderID != id
  );
  await user.save();

  await Reminder.deleteOne({ reminderID: id, userID: user.userID });

  res.json({ message: "Task deleted" });
});

router.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ error: err.message });
});

module.exports = router;
