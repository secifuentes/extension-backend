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

// GET - Estadísticas generales (día, mes, total)
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

// GET - Usuarios activos (en vivo en los últimos 5 minutos)
router.get('/activos', async (req, res) => {
  const hace5Min = new Date(Date.now() - 5 * 60 * 1000); // últimos 5 minutos

  try {
    const visitasActivas = await Visita.aggregate([
      { $match: { fecha: { $gte: hace5Min } } },
      {
        $group: {
          _id: "$ip" // agrupar por IP
        }
      },
      {
        $count: "usuariosActivos"
      }
    ]);

    const cantidad = visitasActivas.length > 0 ? visitasActivas[0].usuariosActivos : 0;

    res.json({ enLinea: cantidad });
  } catch (error) {
    console.error('❌ Error al contar visitas activas:', error);
    res.status(500).json({ error: 'Error al contar visitas activas' });
  }
});

module.exports = router;