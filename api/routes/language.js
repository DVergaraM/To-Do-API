const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();
const Config = require("../models/config");

router.use(express.json());

// localhost:3000/language?guildID=123
router.get("/", async (req, res, next) => {
  const { guildID } = req.query;

  if (!guildID) {
    let newData = {
      code: StatusCodes.OK,
      language: req.app.locals["en"],
    };
    res.send(newData);
    return;
  }

  try {
    const data = await Config.findOne({ guildID });

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: "Guild not found." });
    }

    let dataToSend = req.app.locals[data.language];
    let newData = {
      code: StatusCodes.OK,
      guildID: data.guildID,
      language: dataToSend,
    };
    res.send(newData);
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
