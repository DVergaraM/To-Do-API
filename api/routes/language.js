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
        let newData = {
            code: 200,
            guildID: data.guildID,
            language: dataToSend
        }
        res.send(newData);
    } catch (err) {
        res.status(500).send({ error: "Internal server error." });
    }
});


module.exports = router;
