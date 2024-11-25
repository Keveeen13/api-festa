const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "4512",
  database: "crud_db",
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);
  }
  console.log("Conectado ao MySQL!");
});

// Rotas do CRUD
app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});

app.post("/products", (req, res) => {
  const { name, price, description } = req.body;
  const query = "INSERT INTO products (name, price, description) VALUES (?, ?, ?)";
  db.query(query, [name, price, description], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: results.insertId, name, price, description });
  });
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const query = "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?";
  db.query(query, [name, price, description, id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json({ id, name, price, description });
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json({ deleted: results.affectedRows });
  });
});

// Buscar produto por ID
app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err.message);
    if (results.length === 0) return res.status(404).send("Produto não encontrado");
    res.json(results[0]);
  });
});

// Buscar produtos por nome
app.get("/products/search/:name", (req, res) => {
  const { name } = req.params;
  const query = "SELECT * FROM products WHERE name LIKE ?";
  db.query(query, [`%${name}%`], (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.json(results);
  });
});


app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
