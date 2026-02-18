require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.json({ mensaje: "API Auxiliar (Express) funcionando 🚀" });
});

app.get('/tipos-documento', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipos_documento ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/facultades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM facultades ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/programas', async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.nombre, f.nombre as facultad, p.estado 
      FROM programas p 
      JOIN facultades f ON p.facultad_id = f.id
      ORDER BY p.id ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});