const mongoose = require("mongoose");
const AutoIncrementFactory = require("mongoose-sequence");

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const taskSchema = mongoose.Schema({
  id: Number,
  task: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  date: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  guildID: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  userID: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  status: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
    required: true,
  },
});

taskSchema.plugin(AutoIncrement, {
  inc_field: "id",
});

/**
 * This is a Mongoose model of a task. This model is used to interact with the MongoDB database.
 * @module Task
 * @name Task
 * @type {mongoose.Model<Task>}
 * @requires mongoose
 * @requires mongoose-sequence
 * @property {number} id - The ID of the task.
 * @property {string} task - The task to be completed.
 * @property {string} date - The date the task is due.
 * @property {string} guildID - The ID of the guild the task is associated with.
 * @property {string} userID - The ID of the user the task is associated with.
 * @property {boolean} status - The status of the task.
 * @example
 * const Task = require("../models/task");
 * const task = new Task({
 * task: "Complete homework",
 * date: "2022-12-31",
 * guildID: "123",
 * userID: "456
 * status: false,
 * });
 * task.save();
 * @returns {mongoose.Model} A model of a task.
 * @throws {Error} If the task is missing a required field.
 * @throws {Error} If the task is not found.
 */
module.exports = mongoose.model("Task", taskSchema);
