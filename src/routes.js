const { Router } = require('express');
const ItensLojinha = require('./models/ItensLojinha');
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

module.exports = routes;