import express from 'express';
import Inscripcion from '../models/Inscripcion.js';
import Curso from '../models/Curso.js';

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
      docentes: 0 // Placeholder por ahora
    });
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;