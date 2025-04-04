const express = require('express');
const Inscripcion = require('../models/Inscripcion');
const Curso = require('../models/Curso');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const estudiantes = await Inscripcion.countDocuments();
    const cursos = await Curso.countDocuments();

    const ingresosData = await Inscripcion.find({ pagoConfirmado: true });
    const ingresos = ingresosData.reduce((total, item) => total + (item.valorPagado || 0), 0);

    res.json({
      estudiantes,
      cursos,
      ingresos,
      docentes: 0 // temporal, hasta que implementes la colección de docentes
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;