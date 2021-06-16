const { Router } = require('express');
const ItensLojinha = require('./models/ItensLojinha');
const Tournament = require('./models/tournaments');
const lojinha = require('./scraping/scraping');

const routes = Router();

routes.post('/itenslojinha',async (request, response) => {
    await lojinha();
    await ItensLojinha.deleteMany({});
    await ItensLojinha.create(request.body);
    return response.json({ message: "Lojinha Atualizada com sucesso!!!"});
});

routes.get('/itenslojinha',async (request, response) => {
    const itens = await ItensLojinha.find({});
    return response.json({ lojinha: itens[0].itens});
});

routes.post('/tournament',async (request, response) => {
    //await Tournament();
    console.log(request.body);
    await Tournament.deleteMany({});
    await Tournament.create(request.body);
    return response.json({ message: "Lojinha Atualizada com sucesso!!!"});
});

routes.get('/tournament',async (request, response) => {
    const tournament = await Tournament.find({});
    return response.json({tournament});
});


module.exports = routes;