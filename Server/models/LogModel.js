// import mongoose, { Schema, model, connect } from 'mongoose';
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    level: String,
    message: String,
    resourceId: String,
    timestamp: Date,
    traceId: String,
    spanId: String,
    commit: String,
    metadata: {
      parentResourceId: String,
    },
});

LogSchema.index({ level: 'text', message: 'text' });

// LogSchema = new Schema({
//     level: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     resourceId: {
//         type: String,
//         required: true
//     },
//     timestamp: {
//         type: Date,
//         required: true
//     },
//     traceId: {
//         type: String,
//         required: true
//     },
//     spanId: {
//         type: String,
//         required: true
//     },
//     commit: {
//         type: String,
//         required: true
//     }
// });

const LogModel = mongoose.model('logdata', LogSchema);

module.exports = LogModel;