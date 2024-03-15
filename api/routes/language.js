const express = require("express");

const router = express.Router();

const Config = require("../models/config");

router.use(express.json());

router.get("/", async (req, res, next) => {
    if (!req.body["guildID"])
        return res.status(400).send({
            error: 'Missing parameter "guildID". Please provide a valid guild ID.',
        });

    try {
        const data = await Config.findOne({ guildID: req.body["guildID"] });

        if (!data) return res.status(404).send({ error: "Guild not found." });

        let dataToSend = req.app.locals[data.language];

        res.send(dataToSend);
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
});

router.get("/:lang/:key", (req, res, next) => {
    const key = req.params.key;
    const lang = req.params.lang;
    if (!req.app.locals[lang]) {
        return res.status(404).send({
            error: "Language not found.",
        });
    }
    const data = req.app.locals[lang][key];
    if (!data)
        return res.status(404).send({
            error: "Key not found.",
        });
    res.send({ value: data });
});

module.exports = router;
