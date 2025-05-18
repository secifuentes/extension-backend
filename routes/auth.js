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
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({ token, rol: usuario.rol });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;