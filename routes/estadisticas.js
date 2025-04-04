import express from 'express';
const Inscripcion = require('../models/Inscripcion');
import Curso from '../models/curso.model.js';
import Docente from '../models/docente.model.js'; // solo si tienes esta colección

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const estudiantes = await Inscripcion.countDocuments();
    const cursos = await Curso.countDocuments();
    const docentes = await Docente.countDocuments(); // Si no lo tienes, puedes omitirlo

    const ingresosData = await Inscripcion.find({ pagoConfirmado: true });
    const ingresos = ingresosData.reduce((total, item) => total + (item.valorPagado || 0), 0);

    res.json({
      estudiantes,
      cursos,
      ingresos,
      docentes,
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;