const express = require('express');
const router = express.Router();
const Estudiante = require('../models/Estudiante');

// Buscar estudiante por tipo y número de documento
router.get('/:tipo/:documento', async (req, res) => {
  const { tipo, documento } = req.params;

  try {
    const tiposEquivalentes =
      tipo === 'Tarjeta de Identidad' || tipo === 'Registro Civil'
        ? ['Registro Civil', 'Tarjeta de Identidad']
        : [tipo];

    const estudiante = await Estudiante.findOne({
      tipoDocumento: { $in: tiposEquivalentes },
      documento
    });

    if (!estudiante) {
      return res.status(404).json({ message: 'No encontrado' });
    }

    res.json(estudiante);
  } catch (error) {
    console.error('❌ Error al buscar estudiante:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ✅ Crear un nuevo estudiante
router.post('/', async (req, res) => {
  try {
    const nuevoEstudiante = new Estudiante(req.body);
    await nuevoEstudiante.save();
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error('❌ Error al crear estudiante:', error);
    res.status(500).json({ message: 'Error al crear estudiante' });
  }
});

module.exports = router;