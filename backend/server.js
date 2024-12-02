const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "likeme",
  password: "recetas123", // Cambia esto por tu contraseña de PostgreSQL
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Ruta GET para obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los posts");
  }
});

// Ruta POST para agregar un nuevo post
app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar el post");
  }
});

// Ruta PUT para incrementar los likes de un post
app.put("/posts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Post no encontrado");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al incrementar los likes");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
