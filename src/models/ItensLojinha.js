const mongoose = require('mongoose');

const ItensSchema = new mongoose.Schema({
    itens: [{
        name: String,
        description: String,
        price: String,
        quantity: String,
        picture_URL: String,
    }]
});

module.exports = mongoose.model('ItensLojinha', ItensSchema);