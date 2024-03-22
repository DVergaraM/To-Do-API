const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    }],
    reminders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reminder",
    }]
});

module.exports = mongoose.model('User', userSchema);