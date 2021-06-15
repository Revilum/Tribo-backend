const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
        date: {
            day: String,
        },
        firstTeam: {
            name: String,
            picname: String,
            score: Number,
            image: String,
            result: String,
        },
        secondTeam: {
            name: String,
            picname: String,
            score: Number,
            image: String,
            result: String,
        },
});

module.exports = MatchSchema;