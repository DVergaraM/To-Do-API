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

/**
 * A module that provides routes for the language API.
 * @module LanguageRouter
 * @name LanguageRouter
 * @type {express.Router}
 * @requires express
 * @requires http-status-codes
 * @requires ../models/config
 * @see Config
 * @see http://expressjs.com/en/4x/api.html#router
 * @see https://www.npmjs.com/package/http-status-codes
 * @see https://mongoosejs.com/docs/models.html
 * @see https://mongoosejs.com/docs/guide.html
 * @see https://mongoosejs.com/docs/api.html
 */
module.exports = router;
