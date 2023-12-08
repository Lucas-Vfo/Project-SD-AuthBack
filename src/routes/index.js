const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', async (req, res) => {
  try {
    // Obtener username y password del cuerpo de la solicitud
    const { name, lastname, email, username, password } = req.body;

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Preparar la consulta SQL para insertar el nuevo usuario
    const sql = 'INSERT INTO users (name, lastname, email, username, password) VALUES (?,?,?,?,?)';

    // Ejecutar la consulta SQL
    db.run(sql, [name, lastname, email, username, hashedPassword], function (err) {
      if (err) {
        // Manejo de errores al intentar insertar en la base de datos
        console.error(err);
        res.status(500).send(err);
      } else {
        // Usuario registrado con éxito, devolver el ID del nuevo usuario
        res.status(201).json({ id: this.lastID });
      }
    });
  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;