'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ReviewSchema = new Schema({
    StudyID: {type: String},
    StudyInitials: {type: String},
    RatingComment: {type: String},
    Rating:{type:Number},
    GroundingRate:{type:Number},
    Session: {type: String},
    DateTime: {type: Date},
    Active: {type: Number, required: true},
});

// Export the model
module.exports = mongoose.model('reviewLog', ReviewSchema);