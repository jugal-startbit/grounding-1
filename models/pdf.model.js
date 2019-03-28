'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventLogSchema = new Schema({
    UserInitial: {type: String},
    StudyCode: {type: String},
    Event: {type: String},
    Duration:{type:Number},
    DateTime: {type: Date},
    Active: {type: Number, required: true},
});

// Export the model
module.exports = mongoose.model('pdfEventLog', EventLogSchema);