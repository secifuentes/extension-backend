const express = require('express');
const router = express.Router();
const Visita = require('../models/Visita');

// POST - Registrar visita
router.post('/', async (req, res) => {
  try {
    const visita = new Visita({
      ip: req.ip,
      pagina: req.body.pagina || 'inicio',
    });
    await visita.save();
    res.status(200).json({ mensaje: '✅ Visita registrada' });
  } catch (error) {
    console.error('❌ Error al registrar visita:', error);
    res.status(500).json({ error: 'Error al guardar la visita' });
  }
});

// GET - Estadísticas generales
router.get('/estadisticas', async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mes = new Date();
    mes.setDate(1);
    mes.setHours(0, 0, 0, 0);

    const visitasHoy = await Visita.countDocuments({ fecha: { $gte: hoy } });
    const visitasMes = await Visita.countDocuments({ fecha: { $gte: mes } });
    const totalVisitas = await Visita.countDocuments();

    res.json({
      hoy: visitasHoy,
      mes: visitasMes,
      total: totalVisitas,
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas de visitas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;