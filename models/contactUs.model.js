'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventLogSchema = new Schema({
    StudyID: {type: String},
    StudyInitials: {type: String},
    Event: {type: String},
    Duration:{type:Number},
    Session: {type: String},
    DateTime: {type: Date},
    Active: {type: Number, required: true},
});

// Export the model
module.exports = mongoose.model('contactUsEventLog', EventLogSchema);