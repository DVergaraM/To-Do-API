const express = require("express");

const router = express.Router();

const Config = require("../models/config");

router.use(express.json());

/**
 * / GET the config saved for the guild with id 'guildId'
 * /guilds GET all guilds with saved config
 * / POST Create a new Config for a specific guild
 * / PATCH Update the config for a specific guild
 * / DELETE Delete the config for a specific guild
 */

router.get("/", async (req, res) => {
  if (!req.query["guildID"])
    return res.status(400).send({ error: "Missing required fields" });

  const data = await Config.findOne({ guildID: req.query["guildID"] });

  if (!data) return res.status(404).send({ error: "Guild not found" });
  let newData = {
    guildID: data.guildID,
    channelID: data.channelID,
    userID: data.userID,
    language: data.language,
  };
  res.send(newData);
});

router.get("/guilds", async (_req, res) => {
  try {
    const data = await Config.find({}, "guildID");
    const guildIDs = data.map((config) => config.guildID);
    res.send(guildIDs);
  } catch (err) {
    res.status(500).send({ error: "Internal server error." });
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  if (!req.body["guildID"] || !req.body["language"])
    return res.status(400).send({ error: "Missing required fields" });

  const data = new Config({
    guildID: req.body["guildID"],
    language: req.body["language"],
  });

  try {
    await data.save();
    res.send({
      code: 200,
      message: "Config Saved for guildID: " + req.body["guildID"],
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// This has to be executed on /config execution on the bot
router.patch("/", async (req, res) => {
  if (!req.query["guildID"])
    return res.status(400).send({ error: "Missing field: guildID" });

  try {
    let data;
    let updateObject = {};

    if (req.query["channelID"]) {
      updateObject.channelID = req.query["channelID"];
    }

    if (req.query["userID"]) {
      updateObject.userID = req.query["userID"];
    }

    if (req.query["language"]) {
      updateObject.language = req.query["language"];
    }

    if (Object.keys(updateObject).length === 0) {
      updateObject = {
        channelID: "",
        userID: "",
        language: "en",
      };
    }

    data = await Config.updateOne(
      {
        guildID: req.query["guildID"],
      },
      {
        $set: updateObject,
      }
    );
    if (data.nModified == 0) {
      return res
        .status(404)
        .send({ error: "There's no config values to update." });
    }
    res.send({
      code: 200,
      message: "Config updated for guildID: " + req.query["guildID"],
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// This is for the guildRemove event
router.delete("/", async (req, res) => {
  if (!req.query["guildID"])
    return res.status(400).send({ error: "Missing field: guildID" });

  try {
    const data = await Config.deleteOne({ guildID: req.query["guildID"] });
    if (data.deletedCount == 0) {
      return res
        .status(404)
        .send({ error: "There's no config values to delete." });
    }
    res.send({
      code: 200,
      message: "Config deleted for guildID: " + req.query["guildID"],
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
