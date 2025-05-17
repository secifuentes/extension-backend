const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✨ Función que aplica la plantilla con estilo institucional
const wrapInTemplate = (contenido, nombre, curso, horario) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px; color: #333;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://www.extensionlapresentacion.com/logo.png" alt="Logo de la institución" style="width: 150px; margin-bottom: 20px;" />
        <h1 style="color: #0078D4; font-size: 26px; font-weight: bold;">EXTENSIÓN LA PRESENTACIÓN</h1>
      </div>

      <div style="font-size: 16px; line-height: 1.6; color: #555;">
        ${contenido
          .replace(/{{nombre}}/gi, nombre)
          .replace(/{{curso}}/gi, curso)
          .replace(/{{horario}}/gi, horario || 'el horario asignado')}
      </div>

      <div style="margin-top: 40px; text-align: center; color: #777;">
        <p style="font-size: 14px;">Equipo de Extensión Educativa de La Presentación Girardota</p>
        <p style="font-size: 13px;">Síguenos en nuestras redes sociales:</p>
        <div>
          <a href="https://facebook.com" style="margin: 0 8px; color: #3b5998;">Facebook</a> |
          <a href="https://instagram.com" style="margin: 0 8px; color: #e1306c;">Instagram</a> |
          <a href="https://www.tiktok.com" style="margin: 0 8px; color: #000;">TikTok</a>
        </div>
      </div>
    </div>
  </div>
`;

// 📤 Envío de correos personalizados
router.post('/enviar', async (req, res) => {
  const { seleccionados, asunto, mensajeHtml } = req.body;

  if (!seleccionados || !Array.isArray(seleccionados)) {
    return res.status(400).json({ message: 'Debes enviar un array de IDs de inscripciones.' });
  }

  try {
    const estudiantes = await Inscripcion.find({ _id: { $in: seleccionados } });

    for (const est of estudiantes) {
      const htmlConEstilo = wrapInTemplate(mensajeHtml, est.nombres, est.cursoNombre, est.horario);

      await transporter.sendMail({
        from: `"EXTENSION LA PRESENTACION" <${process.env.MAIL_USER}>`,
        to: est.correo,
        bcc: 'secifuentes@lapresentaciongirardota.edu.co',
        subject: asunto.replace(/{{nombre}}/gi, est.nombres).replace(/{{curso}}/gi, est.cursoNombre),
        html: htmlConEstilo,
      });
    }

    res.status(200).json({ message: `✅ Correos enviados a ${estudiantes.length} estudiantes.` });
  } catch (error) {
    console.error('❌ Error al enviar correos:', error);
    res.status(500).json({ error: 'Error al enviar correos' });
  }
});

module.exports = router;