const mongoose = require('mongoose');
const MatchSchema = require('./matchSchema');

const BracketSchema = new mongoose.Schema({
        eighthFinal: [MatchSchema],
        quarterFinal: [MatchSchema],
        semiFinal: [MatchSchema],
        final: [MatchSchema]
});

module.exports = BracketSchema;