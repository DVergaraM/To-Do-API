const mongoose = require("mongoose");
const User = require("./user");
const Task = require("./task");
const Reminder = require("./reminder");

const configSchema = mongoose.Schema({
  guildID: {
    type: String,
    required: true,
  },
  channelID: {
    type: String,
    required: true,
    default: "",
  },
  userID: {
    type: String,
    required: true,
    default: "",
  },
  language: {
    type: String,
    required: true,
    default: "en",
  },
});

/**
 * This is a Mongoose model of a config. This model is used to interact with the MongoDB database.
 * @module Config
 * @name Config
 * @type {mongoose.Model<Config>}
 * @requires mongoose
 * @property {string} guildID - The ID of the guild the config is associated with.
 * @property {string} channelID - The ID of the channel the config is associated with.
 * @property {string} userID - The ID of the user the config is associated with.
 * @property {string} language - The language of the config.
 * @example
 * const Config = require("../models/config");
 * const config = new Config({
 * guildID: "123",
 * channelID: "456",
 * userID: "789",
 * language: "en",
 * });
 * config.save();
 * @returns {mongoose.Model} A model of a config.
 * @throws {Error} If the config is missing a required field.
 * @throws {Error} If the config is not found.
 * @see User
 * @see Task
 * @see Reminder
 */
module.exports = mongoose.model("Config", configSchema);
