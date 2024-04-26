const mongoose = require("mongoose");
const Task = require("./task");
const Reminder = require("./reminder");

const userSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  reminders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
    },
  ],
});
/**
 * This is a Mongoose model of a user. This model is used to interact with the MongoDB database.
 * @module User
 * @name User
 * @type {mongoose.Model<User>}
 * @requires mongoose
 * @requires Task
 * @requires Reminder
 * @property {string} userID - The ID of the user.
 * @property {Array} tasks - An array of tasks associated with the user.
 * @property {Array} reminders - An array of reminders associated with the user.
 * @see Task
 * @see Reminder
 * @example
 * const User = require("../models/user");
 * const user = new User({
 *  userID: "123",
 * tasks: [],
 * reminders: [],
 * });
 * user.save();
 * @returns {mongoose.Model} A model of a user.
 * @throws {Error} If the user is missing a required field. *
 */
module.exports = mongoose.model("User", userSchema);
