const express = require("express");

const router = express.Router();

const Config = require("../models/config");

router.use(express.json());

/*
 * / GET Language by the Guild ID
 */

router.get("/", async (req, res, next) => {
  if (!req.query["guildID"]) {
    let newData = {
      code: 200,
      language: req.app.locals["en"],
    };
    res.send(newData);
    return;
  }

  try {
    const data = await Config.findOne({ guildID: req.query["guildID"] });

    if (!data) return res.status(404).send({ error: "Guild not found." });

    let dataToSend = req.app.locals[data.language];
    let newData = {
      code: 200,
      guildID: data.guildID,
      language: dataToSend,
    };
    res.send(newData);
  } catch (err) {
    res.status(500).send({ error: "Internal server error." });
  }
});

module.exports = router;
