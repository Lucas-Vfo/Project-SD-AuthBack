const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const prisma = require('@prisma/client');
const { isValidEmail } = require('../utils/isValidEmail');
const { messages } = require('../utils/messages.js');


const prismaDB = new prisma.PrismaClient();
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/auth/register', async (req, res) => {
  try {
    // Obtener username, email y password del cuerpo de la solicitud
    const { name, lastname, email, username, password, confirmPassword } = req.body;

    // Validar campos del registro
    if (!name || !lastname || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ messages: messages.error.needProps });
    }

     // Validar el email
     if (!isValidEmail(email)) {
      return res.status(400).json({ message: messages.error.emailNoValido });
    }

    // Validar que la contraseña sea igual en la confirmación
    if (password !== confirmPassword) {
      return res.status(400).json({ message: messages.error.passwordNotMatch });
    }

    // Encontrar email de usuarios existentes
    const userFind = await prismaDB.user.findFirst({ 
      where: { 
        email: email 
      } 
    });

    if (userFind) {
      return res.status(400).json({ message: messages.error.emailExiste });
    }

    // Encontrar nombre de usuarios existentes
    const existingUser = await prismaDB.user.findFirst({
      where: {
        username: username,
      },
    });
    
    if (existingUser) {
      return res.status(400).json({ message: messages.error.userCreado });
    }

    // El nombre de usuario no está duplicado, continuar con la creación del usuario

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaDB.user.create({
      data: {
        name: name,
        lastname: lastname,
        email: email,
        username: username,
        password: hashedPassword,
      },
    });

    if (!user) {
      return res.status(500).send('No podemos crear el usuario en este momento');
    }

    const token = jwt.sign({ data: user }, 'secreto', {
      expiresIn: 86300,
    });

    res.cookie("auth_cookie", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    // Usuario creado correctamente
    res.status(200).json({
      newUser: user,
      message: messages.success.userCreado,
    });

  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).json({ message: messages.error.default, error: err });
  }
});

// Ruta para eliminar un usuario
router.delete('/auth/delete/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Verificar si el usuario existe
    const user = await prismaDB.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    // Eliminar el usuario
    await prismaDB.user.delete({
      where: {
        id: userId,
      },
    });

    // Usuario eliminado correctamente
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    // Manejo de errores generales
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el usuario', error: err });
  }
});



module.exports = router;