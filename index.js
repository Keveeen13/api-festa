const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(bodyParser.json());

// Dados iniciais
let festas = [];

// Rotas
// 1. Listar festas
app.get('/viewfestas', (req, res) => {
  res.json(festas);
});

// 2. Criar uma nova festa
app.post('/festas', (req, res) => {
  const { nome, data, local, valorIngresso } = req.body;

  if (!nome || !data || !local || !valorIngresso) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, data, local, valorIngresso' });
  }

  const novaFesta = {
    id: festas.length + 1,
    nome,
    data,
    local,
    valorIngresso
  };

  festas.push(novaFesta);
  res.status(201).json(novaFesta);
});

// 3. Atualizar uma festa por ID
app.put('/festas/:id', (req, res) => {
  const { id } = req.params;
  const { nome, data, local, valorIngresso } = req.body;

  const festa = festas.find(f => f.id === parseInt(id));

  if (!festa) {
    return res.status(404).json({ error: 'Festa não encontrada' });
  }

  if (nome) festa.nome = nome;
  if (data) festa.data = data;
  if (local) festa.local = local;
  if (valorIngresso) festa.valorIngresso = valorIngresso;

  res.json(festa);
});

// 4. Excluir uma festa por ID
app.delete('/festas/:id', (req, res) => {
  const { id } = req.params;
  const index = festas.findIndex(f => f.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Festa não encontrada' });
  }

  festas.splice(index, 1);
  res.status(204).send();
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});