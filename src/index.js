const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { tournament } = require('./scraping/scraping');


const app = express();

mongoose.connect('<insdert connection string here>', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json());
app.use(routes);
tournament();

app.listen(3333);
