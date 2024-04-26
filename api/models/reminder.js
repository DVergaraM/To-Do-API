const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose.connection);

const reminderSchema = mongoose.Schema({
  reminderID: {
    type: mongoose.Schema.Types.Number,
  },
  userID: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  hour: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  minute: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  timesPerDay: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: "1",
  },
});

reminderSchema.plugin(AutoIncrement, { inc_field: "reminderID" });
/**
 * This is a Mongoose model of a reminder. This model is used to interact with the MongoDB database.
 * @module Reminder
 * @name Reminder
 * @type {mongoose.Model<Reminder>}
 * @requires mongoose
 * @requires mongoose-sequence
 * @property {number} reminderID - The ID of the reminder.
 * @property {string} userID - The ID of the user the reminder is associated with.
 * @property {string} hour - The hour the reminder is set for.
 * @property {string} minute - The minute the reminder is set for.
 * @property {number} timesPerDay - The number of times per day the reminder is set to repeat.
 * @example
 * const Reminder = require("../models/reminder");
 * const reminder = new Reminder({
 * userID: "123",
 * hour: "12",
 * minute: "00",
 * timesPerDay: 1,
 * });
 * reminder.save();
 * @returns {mongoose.Model} A model of a reminder.
 * @throws {Error} If the reminder is missing a required field.
 * @throws {Error} If the reminder is not found.
 */
module.exports = mongoose.model("Reminder", reminderSchema);
