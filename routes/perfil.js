const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const Inscripcion = require('../models/Inscripcion');

// GET /api/mi-perfil
router.get('/', verificarToken, async (req, res) => {
  try {
    const correo = req.user.correo;

    const inscripciones = await Inscripcion.find({ correo }).sort({ fechaInscripcion: -1 });

    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron inscripciones para este usuario' });
    }

    const estudiante = {
      nombres: inscripciones[0].nombres,
      apellidos: inscripciones[0].apellidos,
      correo: correo,
      cursos: inscripciones.map((i) => ({
        cursoNombre: i.cursoNombre,
        formaPago: i.formaPago,
        pagoConfirmado: i.pagoConfirmado,
        valorPagado: i.valorPagado,
        fechaInscripcion: i.fechaInscripcion,
        pagosMensuales: i.pagosMensuales || [],
      })),
    };

    res.json(estudiante);
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;