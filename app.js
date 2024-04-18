const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const languageRoutes = require("./api/routes/language");
const configRoutes = require("./api/routes/config");
const taskRoutes = require("./api/routes/task");
const reminderRoutes = require("./api/routes/reminder");
const userRoutes = require("./api/routes/users");
const { setLocals } = require("./methods");
require("dotenv").config();

mongoose.connect(process.env.mongoURI);
setLocals(app);

app.use(morgan("dev"));
app.use(cors());

app.use("/language", languageRoutes);
app.use("/config", configRoutes);
app.use("/tasks", taskRoutes);
app.use("/reminders", reminderRoutes);
app.use("/users", userRoutes);

app.use((_req, _res, next) => {
  const error = new Error("Not found");
  error.status = StatusCodes.NOT_FOUND;
  next(error);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
