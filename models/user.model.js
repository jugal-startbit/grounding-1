'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    StudyID: { type: String },
    StudyInitials: { type: String },
    Active: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model('user', UserSchema);