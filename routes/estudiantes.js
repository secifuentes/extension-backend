const express = require('express');
const router = express.Router();
const Estudiante = require('../models/Estudiante');

// Buscar estudiante por tipo y número de documento (flexible con tipos de documento)
router.get('/:tipoDoc/:documento', async (req, res) => {
  const { tipoDoc, documento } = req.params;

  try {
    const docNormalizado = tipoDoc.trim();
    const documentoLimpio = documento.trim();

    // Intento 1: Búsqueda exacta
    let estudiante = await Estudiante.findOne({
      tipoDocumento: new RegExp(`^${docNormalizado}$`, 'i'),
      documento: documentoLimpio,
    });

    // Intento 2: Buscar por equivalentes si no se encontró
    if (!estudiante) {
      const equivalentes = {
        'Tarjeta de Identidad': ['Registro Civil'],
        'Registro Civil': ['Tarjeta de Identidad'],
      };

      const alternativas = equivalentes[docNormalizado] || [];

      for (const alt of alternativas) {
        estudiante = await Estudiante.findOne({
          tipoDocumento: new RegExp(`^${alt}$`, 'i'),
          documento: documentoLimpio,
        });
        if (estudiante) break;
      }
    }

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (err) {
    console.error('❌ Error al buscar estudiante:', err);
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