const mongoose = require('mongoose');
const BracketSchema = require('./utils/bracketSchema');

const TournamentSchema = new mongoose.Schema({
        group_A: {
            upperBracket: BracketSchema,
            lowerBracket: BracketSchema,
        },
        group_B: {
            upperBracket: BracketSchema,
            lowerBracket: BracketSchema,
        },
        playoff: BracketSchema,
        prize_distribuition: [{
            name: String,
            placement: String,
            prizeMoney: String,
        }],
        teams: [{
            name: String,
            picname: String,
            rank: String,
            players: [String],
        }]
});

module.exports = mongoose.model('Tournament', TournamentSchema);