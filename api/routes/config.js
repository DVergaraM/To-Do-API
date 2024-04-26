const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const Config = require("../models/config");

router.use(express.json());

// localhost:3000/config?guildID=123
router.get("/", async (req, res, next) => {
  const { guildID } = req.query;

  if (!guildID) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });
  }

  try {
    const data = await Config.findOne({ guildID });

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Guild not found" });
    }

    res.send(data);
  } catch (err) {
    next(err);
  }
});

// localhost:3000/config/guilds
router.get("/guilds", async (_req, res) => {
  try {
    const data = await Config.find({}, "guildID");
    const guildIDs = data.map((config) => config.guildID);
    res.send(guildIDs);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal server error." });
    console.log(err);
  }
});

//localhost:3000/config/guilds/count
router.get("/guilds/count", async (_req, res) => {
  try {
    const count = await Config.countDocuments({});
    res.send({ count: count });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "Internal server error." });
    console.log(err);
  }
});

// localhost:3000/config
/*
body : {
  "guildID": "123",
  "language": "en"
}
*/
router.post("/", async (req, res) => {
  if (!req.body["guildID"] || !req.body["language"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing required fields" });

  const data = new Config({
    guildID: req.body["guildID"],
    language: req.body["language"],
  });

  try {
    await data.save();
    res.send({
      code: StatusCodes.CREATED,
      message: "Config Saved for guildID: " + req.body["guildID"],
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

// This has to be executed on /config execution on the bot
// localhost:3000/config?guildID=123
router.put("/", async (req, res) => {
  if (!req.query["guildID"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: guildID" });

  try {
    let data;
    let updateObject = {};
    // &channelID=123
    if (req.query["channelID"]) {
      updateObject.channelID = req.query["channelID"];
    }
    // &userID=123
    if (req.query["userID"]) {
      updateObject.userID = req.query["userID"];
    }
    // &language=en
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
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "There's no config values to update." });
    }
    res.send({
      code: StatusCodes.OK,
      message: "Config updated for guildID: " + req.query["guildID"],
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

// This is for the guildRemove event
// localhost:3000/config?guildID=123
router.delete("/", async (req, res) => {
  if (!req.query["guildID"])
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Missing field: guildID" });

  try {
    const data = await Config.deleteOne({ guildID: req.query["guildID"] });
    if (data.deletedCount == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "There's no config values to delete." });
    }
    res.send({
      code: StatusCodes.OK,
      message: "Config deleted for guildID: " + req.query["guildID"],
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.use((err, _req, res, _next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: err.message });
});

/**
 * A router object that handles config requests.
 * @module ConfigRouter
 * @name ConfigRouter
 * @type {express.Router}
 * @requires express
 * @requires http-status-codes
 * @requires ../models/config
 * @see Config
 * @see http://expressjs.com/en/4x/api.html#router
 * @see https://www.npmjs.com/package/http-status-codes
 */
module.exports = router;
