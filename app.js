const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const languageRoutes = require("./api/routes/language");
const configRoutes = require("./api/routes/config");
const taskRoutes = require('./api/routes/task');
const reminderRoutes = require('./api/routes/reminder');
const userRoutes = require('./api/routes/users');
const setLocals = require("./methods");
require("dotenv").config();

mongoose.connect(process.env.mongoURI);
setLocals(app);

app.use(morgan("dev"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/language", languageRoutes);
app.use("/config", configRoutes);
app.use('/tasks', taskRoutes);
app.use('/reminders', reminderRoutes);
app.use('/users', userRoutes);

// Error handling middleware should be placed after the routes
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
    
})

module.exports = app;
