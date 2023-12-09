const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = require('../db');

const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', async (req, res) => {
  try {
    // Obtener username y password del cuerpo de la solicitud
    const { name, lastname, username, password } = req.body;

    // Crear una nueva conexión a la base de datos
    const db = new sqlite3.Database('./SDAuth.sqlite', async (err) => {
    if (err) {
     console.error(err.message);
     return;
    }

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Preparar la consulta SQL para insertar el nuevo usuario
    const sql = 'INSERT INTO users (name, lastname, username, password) VALUES (?,?,?,?)';

    // Ejecutar la consulta SQL
    db.run(sql, [name, lastname, username, hashedPassword], function (err) {
      if (err) {
        // Manejo de errores al intentar insertar en la base de datos
        console.error(err.message);
        res.status(500).json({ error: 'Error en la base de datos' });
      } else {
        // Usuario registrado con éxito, devolver el ID del nuevo usuario
        res.status(201).json({ id: this.lastID });
      }
    });
    // Cerrar la conexión a la base de datos
    db.close();
  });

  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;