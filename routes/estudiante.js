const express = require('express');
const router = express.Router();
const Estudiante = require('../models/Estudiante');

// Buscar estudiante por tipo y número de documento
router.get('/:tipoDoc/:documento', async (req, res) => {
  const { tipoDoc, documento } = req.params;

  try {
    const estudiante = await Estudiante.findOne({
      tipoDocumento: tipoDoc,
      documento: documento,
    });

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (err) {
    console.error('❌ Error al buscar estudiante:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;