const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  /**
   * GET /repositories: Rota que lista todos os repositórios;
   */

  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const params = request.body;
  const validRequest = params.url && params.title && params.techs;

  /**
   * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição,
   * endo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de
   * um objeto no seguinte formato:
   * { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 };
   * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
   */

  if (!validRequest) {
    response.status(400).json({
      message: 'Invalid request! Params url, title and techs are required',
      params,
    });
  }

  const id = uuid();

  const newRepo = {
    id,
    ...params,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.status(201).json(newRepo);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { techs, title, url } = request.body;
  /*
   * PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual
   * ao id presente nos parâmetros da rota;
   */

  let targetRepo = repositories.find((repo) => repo.id == id);

  targetRepo.title = title ? title : targetRepo.title;
  targetRepo.url = url ? url : targetRepo.url;
  targetRepo.techs = techs ? techs : targetRepo.techs;

  return response.status(200).json(targetRepo);
});

app.delete('/repositories/:id', (request, response) => {
  // TODO
});

app.post('/repositories/:id/like', (request, response) => {
  // TODO
});

module.exports = app;
