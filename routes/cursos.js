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

// Crear un nuevo curso
router.post('/', async (req, res) => {
  try {
    const nuevoCurso = new Curso(req.body);
    await nuevoCurso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error('❌ Error al crear curso:', error);
    res.status(500).json({ error: 'No se pudo crear el curso' });
  }
});

// ❗ Endpoint temporal para eliminar todos los cursos
router.delete('/eliminar-todos', async (req, res) => {
  try {
    await Curso.deleteMany({});
    res.status(200).json({ mensaje: '✅ Todos los cursos han sido eliminados' });
  } catch (error) {
    console.error('❌ Error al eliminar cursos:', error);
    res.status(500).json({ error: 'Error al eliminar los cursos' });
  }
});

module.exports = router;