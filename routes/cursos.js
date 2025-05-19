const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const Inscripcion = require('../models/Inscripcion');
const mongoose = require("mongoose");

// 🧠 Función para generar slug automáticamente desde el nombre
const generarSlug = (nombre) =>
  nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// 📌 Obtener todos los cursos con cantidad de inscritos
router.get('/con-inscritos', async (req, res) => {
  try {
    const cursos = await Curso.find().select('+horarios +horario');

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

// 🔍 Obtener todos los cursos (sin contar inscritos)
router.get('/', async (req, res) => {
  try {
    const cursos = await Curso.find().sort({ nombre: 1 }); // Orden alfabético opcional
    res.json(cursos);
  } catch (error) {
    console.error('❌ Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// ✅ Crear un nuevo curso con slug automático
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    data.slug = generarSlug(data.nombre); // 👈 genera slug automáticamente

    const nuevoCurso = new Curso(data);
    await nuevoCurso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error('❌ Error al crear curso:', error);
    res.status(500).json({ error: 'No se pudo crear el curso' });
  }
});

// 🗑️ Endpoint temporal para eliminar todos los cursos
router.delete('/eliminar-todos', async (req, res) => {
  try {
    await Curso.deleteMany({});
    res.status(200).json({ mensaje: '✅ Todos los cursos han sido eliminados' });
  } catch (error) {
    console.error('❌ Error al eliminar cursos:', error);
    res.status(500).json({ error: 'Error al eliminar los cursos' });
  }
});

// ✏️ Actualizar curso por ID
// ✏️ Actualizar curso por ID (incluyendo horarios)
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;

    // Si cambia el nombre, actualizar slug
    if (data.nombre) {
      data.slug = generarSlug(data.nombre);
    }

    // Asegurar que "horarios" sea un array
    if (typeof data.horarios === 'string') {
      data.horarios = [data.horarios];
    }

    const cursoActualizado = await Curso.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );

    res.json(cursoActualizado);
  } catch (error) {
    console.error('❌ Error al actualizar curso:', error);
    res.status(500).json({ error: 'No se pudo actualizar el curso' });
  }
});

/// ✅ Obtener cursos asignados a un docente por su ID (primero)
router.get('/docente/:id', async (req, res) => {
  try {
    const docenteId = new mongoose.Types.ObjectId(req.params.id);
    const cursos = await Curso.find({ docente: docenteId }).sort({ nombre: 1 });
    res.json(cursos);
  } catch (error) {
    console.error('❌ Error al obtener cursos del docente:', error);
    res.status(500).json({ error: 'Error al obtener cursos del docente' });
  }
});

// 📍 Obtener curso por ID (después)
router.get('/:id', async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(curso);
  } catch (error) {
    console.error('❌ Error al obtener curso por ID:', error);
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
});

// 🧩 Obtener un curso por su slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const curso = await Curso.findOne({ slug: req.params.slug });
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(curso);
  } catch (error) {
    console.error('❌ Error al buscar curso por slug:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



module.exports = router;