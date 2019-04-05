'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FeedbackSchema = new Schema({
    StudyID: {type: String},
    StudyInitials: {type: String},
    Payload: {type: Object},
    Session: {type: String},
    DateTime: {type: Date},
    Active: {type: Number, required: true},
});

// Export the model
module.exports = mongoose.model('feedbackLog', FeedbackSchema);