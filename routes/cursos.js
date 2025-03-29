const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const Inscripcion = require('../models/Inscripcion');

// Obtener todos los cursos con cantidad de inscritos
router.get('/con-inscritos', async (req, res) => {
  try {
    const cursos = await Curso.find();

    const conteo = await Inscripcion.aggregate([
      { $group: { _id: "$cursoId", total: { $sum: 1 } } }
    ]);

    const conteoMap = {};
    conteo.forEach(item => {
      conteoMap[item._id] = item.total;
    });

    const cursosConInscritos = cursos.map(curso => ({
      ...curso.toObject(),
      inscritos: conteoMap[curso._id.toString()] || 0
    }));

    res.json(cursosConInscritos);
  } catch (err) {
    console.error('❌ Error en /con-inscritos:', err);
    res.status(500).json({ error: 'Error al obtener cursos con inscritos' });
  }
});

module.exports = router;