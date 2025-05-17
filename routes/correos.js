const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Ruta para enviar correo personalizado a múltiples estudiantes
router.post('/enviar', async (req, res) => {
  const { inscripcionesIds, asunto, mensajeHtml } = req.body;

  if (!inscripcionesIds || !Array.isArray(inscripcionesIds)) {
    return res.status(400).json({ message: 'Debes enviar un array de IDs de inscripciones.' });
  }

  try {
    const inscripciones = await Inscripcion.find({ _id: { $in: inscripcionesIds } });

    for (const inscripcion of inscripciones) {
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: inscripcion.correo,
        subject: asunto || `Curso de ${inscripcion.cursoNombre} - Información importante`,
        html: mensajeHtml.replace('{{nombre}}', inscripcion.nombres).replace('{{curso}}', inscripcion.cursoNombre).replace('{{horario}}', inscripcion.horario || 'el horario asignado'),
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: `Correos enviados a ${inscripciones.length} estudiantes.` });
  } catch (error) {
    console.error('❌ Error al enviar correos:', error);
    res.status(500).json({ message: 'Error al enviar los correos.' });
  }
});

module.exports = router;