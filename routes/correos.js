const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 📩 Plantilla HTML con diseño institucional
const wrapInTemplate = (contenido, nombre, curso, horario) => `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px 20px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <div style="text-align: center;">
        <img src="https://www.extensionlapresentacion.com/logo-extension.png" alt="Logo Extensión" style="width: 120px; margin-bottom: 20px;" />
        <h2 style="color: #21145F; font-size: 20px; margin-bottom: 10px;">EXTENSIÓN LA PRESENTACIÓN</h2>
      </div>

      <div style="font-size: 16px; color: #333; line-height: 1.6;">
        ${contenido
          .replace('{{nombre}}', nombre)
          .replace('{{curso}}', curso)
          .replace('{{horario}}', horario || 'el horario asignado')}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://extensionlapresentacion.com" style="display: inline-block; padding: 12px 30px; background-color: #21145F; color: white; border-radius: 30px; text-decoration: none; font-weight: bold;">Visitar plataforma</a>
      </div>

      <div style="text-align: center; font-size: 14px; color: #777;">
        <p style="font-style: italic;">"Más que cursos, experiencias que inspiran."</p>
        <p style="margin-top: 30px;">EQUIPO DE EXTENSIÓN LA PRESENTACIÓN<br>Girardota – Antioquia</p>
        <p style="margin-top: 10px;">Síguenos en nuestras redes sociales:</p>
        <p>
          <a href="https://instagram.com" style="margin: 0 6px; color: #C13584;">Instagram</a> |
          <a href="https://facebook.com" style="margin: 0 6px; color: #1877F2;">Facebook</a> |
          <a href="https://youtube.com" style="margin: 0 6px; color: #FF0000;">YouTube</a>
        </p>
      </div>
    </div>
  </div>
`;

// 📤 Enviar correos personalizados
router.post('/enviar', async (req, res) => {
  const { seleccionados, asunto, mensajeHtml } = req.body;

  if (!seleccionados || !Array.isArray(seleccionados)) {
    return res.status(400).json({ message: 'Debes enviar un array de IDs de inscripciones.' });
  }

  try {
    const estudiantes = await Inscripcion.find({ _id: { $in: seleccionados } });

    for (const est of estudiantes) {
      const mensajeFinal = wrapInTemplate(mensajeHtml, est.nombres, est.cursoNombre, est.horario);

      await transporter.sendMail({
        from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
        to: est.correo,
        bcc: 'secifuentes@lapresentaciongirardota.edu.co',
        subject: `🎉 Bienvenido ${est.nombres} al curso de ${est.cursoNombre}`,
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