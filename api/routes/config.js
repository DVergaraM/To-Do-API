const express = require("express");

const router = express.Router();

const Config = require("../models/config");

router.use(express.json());

// This is for the /config execution on the bot
router.get("/", async (req, res) => {
    if (!req.body["guildID"])
        return res.status(400).send({ error: "Missing required fields" });

    const data = await Config.findOne({ guildID: req.body["guildID"] });

    if (!data) return res.status(404).send({ error: "Guild not found" });
    let newData = {
        guildID: data.guildID,
        channelID: data.channelID,
        userID: data.userID,
        language: data.language,
    };
    res.send(newData);
});

// This is for the guildCreate event on the bot
router.post("/", async (req, res) => {
    if (!req.body["guildID"] || !req.body["language"])
        return res.status(400).send({ error: "Missing required fields" });

    const data = new Config({
        guildID: req.body["guildID"],
        language: req.body["language"],
    });

    try {
        const saved = await data.save();
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
    if (!req.body["guildID"])
        return res.status(400).send({ error: "Missing field: guildID" });

    try {
        let data;
        switch (true) {
            case !!req.body["channelID"] && !req.body["userID"]:
                data = await Config.updateOne(
                    {
                        guildID: req.body["guildID"],
                    },
                    {
                        $set: {
                            channelID: req.body["channelID"],
                        },
                    }
                );
                break;
            case !req.body["channelID"] && !!req.body["userID"]:
                data = await Config.updateOne(
                    {
                        guildID: req.body["guildID"],
                    },
                    {
                        $set: {
                            userID: req.body["userID"],
                        },
                    }
                );
                break;
            case !!req.body["channelID"] && !!req.body["userID"]:
                data = await Config.updateOne(
                    {
                        guildID: req.body["guildID"],
                    },
                    {
                        $set: {
                            channelID: req.body["channelID"],
                            userID: req.body["userID"],
                        },
                    }
                );
                break;
            default:
                data = await Config.updateOne(
                    {
                        guildID: req.body["guildID"],
                    },
                    {
                        $set: {
                            channelID: "0",
                            userID: "0",
                        },
                    }
                );
        }
        if (data.nModified == 0) {
            return res
                .status(404)
                .send({ error: "There's no config values to update." });
        }
        res.send({
            code: 200,
            message: "Config updated for guildID: " + req.body["guildID"],
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

// This is for the guildRemove event
router.delete("/", async (req, res) => {
    if (!req.body["guildID"])
        return res.status(400).send({ error: "Missing field: guildID" });

    try {
        const data = await Config.deleteOne({ guildID: req.body["guildID"] });
        if (data.deletedCount == 0) {
            return res
                .status(404)
                .send({ error: "There's no config values to delete." });
        }
        res.send({
            code: 200,
            message: "Config deleted for guildID: " + req.body["guildID"],
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
