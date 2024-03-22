const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    guildID: {
        type: String,
        required: true,
    },
    channelID: {
        type: String,
        required: true,
        default: "",
    },
    userID: {
        type: String,
        required: true,
        default: "",
    },
    language: {
        type: String,
        required: true,
        default: "en",
    }
})


module.exports = mongoose.model('Config', configSchema);
// Path: api/routes/config.js