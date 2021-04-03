const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Midlewares
function validateUuidInput(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      message: 'Invalid UUID!',
      description: `UUID: ${id} is not valid`,
    });
  }

  next();
}

function validateResource(req, res, next) {
  const { id } = req.params;

  const repo = repositories.find((repo) => repo.id == id);

  if (!repo) {
    return res.status(404).json({
      message: 'Resource not found!',
      description: `Resource not found with id: ${id}`,
    });
  }

  next();
}

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const params = request.body;
  const validRequest = params.url && params.title && params.techs;

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

app.put(
  '/repositories/:id',
  validateUuidInput,
  validateResource,
  (request, response) => {
    const { id } = request.params;
    const { techs, title, url } = request.body;

    let targetRepo = repositories.find((repo) => repo.id == id);

    targetRepo.title = title ? title : targetRepo.title;
    targetRepo.url = url ? url : targetRepo.url;
    targetRepo.techs = techs ? techs : targetRepo.techs;

    return response.status(200).json(targetRepo);
  }
);

app.delete('/repositories/:id', validateUuidInput, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex((repo) => repo.id == id);

  repositories.splice(repoIndex, 1);

  return response.status(204).json();
});

app.post(
  '/repositories/:id/like',
  validateUuidInput,
  validateResource,
  (request, response) => {
    const { id } = request.params;
    const repo = repositories.find((repo) => repo.id == id);

    repo.likes += 1;

    return response.status(201).json(repo);
  }
);

module.exports = app;
