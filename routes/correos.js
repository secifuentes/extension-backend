const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 📘 Obtener estudiantes confirmados por curso
router.get('/estudiantes-por-curso/:cursoNombre', async (req, res) => {
  try {
    const estudiantes = await Inscripcion.find({
      cursoNombre: req.params.cursoNombre,
      pagoConfirmado: true,
    });
    res.json(estudiantes);
  } catch (error) {
    console.error('❌ Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
});

// 📤 Enviar correos personalizados
router.post('/enviar', async (req, res) => {
  const { seleccionados, asunto, mensajeHtml } = req.body;

  if (!seleccionados || !Array.isArray(seleccionados)) {
    return res.status(400).json({ message: 'Debes enviar un array de IDs de inscripciones.' });
  }

  try {
    const estudiantes = await Inscripcion.find({ _id: { $in: seleccionados } });

    for (const est of estudiantes) {
      const mensajeFinal = mensajeHtml
        .replace('{{nombre}}', est.nombres)
        .replace('{{curso}}', est.cursoNombre)
        .replace('{{horario}}', est.horario || 'el horario asignado');

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: est.correo,
        subject: asunto || `📢 Información de tu curso: ${est.cursoNombre}`,
        html: mensajeFinal,
      });
    }

    res.status(200).json({ message: `✅ Correos enviados a ${estudiantes.length} estudiantes.` });
  } catch (error) {
    console.error('❌ Error al enviar correos:', error);
    res.status(500).json({ error: 'Error al enviar correos' });
  }
});

module.exports = router;