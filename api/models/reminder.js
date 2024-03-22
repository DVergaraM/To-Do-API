const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose.connection);

const reminderSchema = mongoose.Schema({
    reminderID: {
        type: mongoose.Schema.Types.Number,
    },
    userID: {
        type: mongoose.Schema.Types.String,
        ref: "User",
        required: true
    },
    hour: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    minute: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    timesPerDay: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: "1"
    }
})

reminderSchema.plugin(AutoIncrement, {inc_field: 'reminderID'});

module.exports = mongoose.model('Reminder', reminderSchema);