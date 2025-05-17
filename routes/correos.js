const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🚀 Configurar Nodemailer con nombre personalizado en el remitente
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 🎨 Función para aplicar plantilla visual al mensaje
const wrapInTemplate = (contenido, nombre, curso, horario) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px; color: #333;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://www.extensionlapresentacion.com/logo.png" alt="Logo de la institución" style="width: 120px; margin-bottom: 20px;" />
        <h2 style="color: #0078D4;">Extensión Educativa</h2>
      </div>
      <div style="font-size: 16px; line-height: 1.6; color: #555;">
        ${contenido
          .replace('{{nombre}}', nombre)
          .replace('{{curso}}', curso)
          .replace('{{horario}}', horario || 'el horario asignado')}
      </div>
      <div style="margin-top: 40px; text-align: center; color: #777;">
        <p style="font-size: 14px;">Equipo de Extensión Educativa de La Presentación Girardota</p>
        <p style="font-size: 13px;">Síguenos en nuestras redes sociales:</p>
        <div>
          <a href="https://facebook.com" style="margin: 0 8px; color: #3b5998;">Facebook</a> |
          <a href="https://instagram.com" style="margin: 0 8px; color: #e1306c;">Instagram</a>
        </div>
      </div>
    </div>
  </div>
`;

// 📘 Ruta para obtener estudiantes confirmados de un curso
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

// 📤 Ruta para enviar correos personalizados
router.post('/enviar', async (req, res) => {
  const { seleccionados, asunto, mensajeHtml } = req.body;

  if (!seleccionados || !Array.isArray(seleccionados)) {
    return res.status(400).json({ message: 'Debes enviar un array de IDs de inscripciones.' });
  }

  try {
    const estudiantes = await Inscripcion.find({ _id: { $in: seleccionados } });

    for (const est of estudiantes) {
      const mensajeFinal = wrapInTemplate(mensajeHtml, est.nombres, est.cursoNombre, est.horario);
      const asuntoFinal = (asunto || `📢 Información de tu curso: {{curso}}`)
        .replace('{{nombre}}', est.nombres)
        .replace('{{curso}}', est.cursoNombre);

      await transporter.sendMail({
        from: `"EXTENSION LA PRESENTACION" <${process.env.MAIL_USER}>`,
        to: est.correo,
        bcc: 'extension@lapresentaciongirardota.edu.co',
        subject: asuntoFinal,
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