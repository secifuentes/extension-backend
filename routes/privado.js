const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, (req, res) => {
  res.json({
    mensaje: `Hola ${req.user.correo}, esta es una ruta protegida 🚀`,
    usuario: req.user
  });
});

module.exports = router;