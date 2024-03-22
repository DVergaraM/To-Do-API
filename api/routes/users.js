const express = require("express");
const router = express.Router();

const Task = require("../models/task");
const User = require("../models/user");
const Reminder = require("../models/reminder");

router.use(express.json());
/**
 * /: GET
 * /:id GET User by it's ID
 * /:id/reminders GET Reminders by User ID
 * /:id/tasks GET Tasks by User ID
 */


router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", getUser, (req, res) => {
    res.json(res.user);
});

/**
 * Retrieves a user by ID.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is retrieved.
 */
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findOne({ userID: req.params.id });
        if (!user) return res.sendStatus(404);
        req.user = user;
        next();
    } catch (err) {
        return res.sendStatus(500);
    }
}

router.get("/:id/reminders/", getUser, async (req, res) => {
    try {
        const reminders = await Reminder.find({ userID: req.params.id });
        res.json(reminders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id/tasks/", getUser, async (req, res) => {
    try {
        const tasks = await Task.find({ userID: req.params.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;