const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/login
router.post('/', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: 'Correo no registrado' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // 🧾 Generar token
    const token = jwt.sign(
      {
        id: usuario._id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno en login' });
  }
});

module.exports = router;