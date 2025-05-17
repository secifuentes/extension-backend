const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🚀 Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 📦 Plantilla institucional (estilo, logo, márgenes)
const wrapInTemplate = (contenido, nombre, curso, horario) => `
  <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',sans-serif;">
    <div style="max-width:600px;width:100%;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.06);padding:30px;box-sizing:border-box;">
      
      <!-- Logo -->
      <div style="text-align:center;margin-bottom:20px;">
        <img src="https://www.extensionlapresentacion.com/logo_extensionce.jpg" alt="Logo Extensión La Presentación" style="max-width:180px;" />
      </div>

      <!-- Encabezado -->
      <h2 style="text-align:center;color:#21145F;font-size:26px;margin-bottom:30px;">
        ¡Hola <span style="color:#21145F;">${nombre}</span>!
      </h2>

      <!-- Contenido personalizado -->
      <div style="font-size:16px;line-height:1.7;color:#555;margin-bottom:20px;">
        ${contenido
          .replace(/{{nombre}}/gi, nombre)
          .replace(/{{curso}}/gi, curso)
          .replace(/{{horario}}/gi, horario || 'el horario asignado')}
      </div>

      <!-- Firma -->
      <h3 style="text-align:center;color:#21145F;margin-top:40px;font-size:18px;">
        EQUIPO DE EXTENSIÓN LA PRESENTACIÓN
      </h3>
      <p style="text-align:center;font-size:13px;color:#aaa;">Girardota – Antioquia</p>

      <!-- Redes sociales -->
      <div style="text-align:center;margin-top:25px;">
        <p style="font-size:15px;font-weight:bold;color:#444;">Síguenos en nuestras redes sociales:</p>
        <p style="font-size:14px;color:#888;line-height:2;margin:10px 0;">
          <a href="https://instagram.com/presentaciongirardota" style="color:#d4a017;text-decoration:none;">Instagram</a> |
          <a href="https://www.tiktok.com/@presentaciongirardota" style="color:#d4a017;text-decoration:none;">TikTok</a> |
          <a href="https://www.facebook.com/presentaciondegirardota" style="color:#d4a017;text-decoration:none;">Facebook</a> |
          <a href="https://www.youtube.com/@Presentaciongirardota" style="color:#d4a017;text-decoration:none;">YouTube</a>
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
        subject: asunto
          .replace(/{{nombre}}/gi, est.nombres)
          .replace(/{{curso}}/gi, est.cursoNombre),
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