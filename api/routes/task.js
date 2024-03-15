const express = require("express");

const router = express.Router();

const Task = require("../models/task");

router.use(express.json());

router.get("/", async (req, res) => {
    if (!req.body["guildID"])
        return res.status(400).send({ error: "Missing required fields" });

    const data = await Task.find({ guildID: req.body["guildID"] });

    if (!data) return res.status(404).send({ error: "Guild not found" });

    let newData = [];

    data.forEach((task) => {
        newData.push({
            id: task.id,
            task: task.task,
            date: task.date,
            guildID: task.guildID,
            userID: task.userID,
            status: task.status,
        });
    });

    if (newData.length === 0)
        return res
            .status(404)
            .send({ error: `No tasks found for ${req.body["guildID"]}` });

    res.send(newData);
});

router.post("/", async (req, res) => {
    if (
        !req.body["task"] ||
        !req.body["date"] ||
        !req.body["guildID"] ||
        !req.body["userID"]
    )
        return res.status(400).send({ error: "Missing required fields" });

    const data = new Task({
        task: req.body["task"],
        date: req.body["date"],
        guildID: req.body["guildID"],
        userID: req.body["userID"],
        status: req.body["status"],
    });

    try {
        const saved = await data.save();
        res.send({
            code: 200,
            message: "Task Saved for guildID: " + req.body["guildID"],
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch("/", async (req, res) => {
    if (!req.body["id"])
        return res.status(400).send({ error: "Missing field: id" });

    try {
        switch (true) {
            case !!req.body["status"]:
                await Task.updateOne(
                    {
                        id: req.body["id"],
                    },
                    {
                        status: req.body["status"],
                    }
                );
                break;
            default:
                return res.status(400).send({ error: "Invalid request" });
        }
        res.send({
            code: 200,
            message: "Task Updated for id: " + req.body["id"],
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/", async (req, res) => {
    if (!req.body["id"])
        return res.status(400).send({ error: "Missing field: id" });

    try {
        await Task.deleteOne({ id: req.body["id"] });
        res.send({
            code: 200,
            message: "Task Deleted for id: " + req.body["id"],
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
