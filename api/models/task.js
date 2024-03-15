const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

const taskSchema = mongoose.Schema({
    id: Number,
    task: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    date: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    status: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
        required: true,
    },
});

taskSchema.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = connection.model('Task', taskSchema);