const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Función para enviar el correo de confirmación con HTML estilizado
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: `${inscripcion.nombres}, TE DAMOS LA BIENVENIDA AL CURSO "${inscripcion.cursoNombre}" DE EXTENSIÓN LA PRESENTACIÓN`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px; color: #333;">
          
          <h2 style="text-align: center; color: #21145F; font-size: 24px; margin-bottom: 10px;">
            ¡Hola <span style="color: #21145F;">${inscripcion.nombres}</span>! 👋
          </h2>

          <p style="text-align: center; font-size: 18px; color: #444; margin-top: 0;">
            Te damos la bienvenida al curso <strong style="color: #1a428a;">"${inscripcion.cursoNombre}"</strong> 💼
          </p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

          <p style="font-size: 16px; line-height: 1.7; color: #555;">
            Nos alegra muchísimo tenerte con nosotros en este camino de aprendizaje. 
            Ahora formas parte de la familia de <strong style="color: #21145F;">EXTENSIÓN LA PRESENTACIÓN</strong>, donde juntos 
            <strong style="color: #d4a017;">Creamos, Sentimos y Transformamos</strong>.
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #fef8e7; border-left: 5px solid #d4a017; border-radius: 5px; font-size: 15px; color: #5a4e26;">
            📬 Tu docente asignado se comunicará contigo muy pronto a través de este medio con toda la información necesaria. 
            <br />Por favor, mantente atento(a) a tu correo.
          </div>

          <p style="font-size: 15px; color: #555;">
            Gracias por elegirnos para seguir creciendo. Este es solo el comienzo de una experiencia maravillosa. 
            ¡Nos emociona acompañarte!
          </p>

          <h3 style="text-align: center; color: #21145F; margin-top: 30px; font-size: 20px; letter-spacing: 1px;">
            EXTENSIÓN LA PRESENTACIÓN
          </h3>
          <p style="text-align: center; font-size: 13px; color: #aaa;">Girardota - Antioquia</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al enviar el correo:', error);
    } else {
      console.log('✅ Correo de confirmación enviado: ' + info.response);
    }
  });
};

// POST - Guardar nueva inscripción
router.post('/', async (req, res) => {
  try {
    console.log("Datos recibidos para inscripción: ", req.body);

    const nueva = new Inscripcion(req.body);
    await nueva.save();
    res.status(201).json({ mensaje: '✅ Inscripción guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar inscripción:', error);
    res.status(500).json({ error: 'Error al guardar inscripción', detalle: error.message });
  }
});

// GET - Obtener todas las inscripciones
router.get('/', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find().sort({ fechaInscripcion: -1 });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

// PUT - Confirmar pago e enviar correo
router.put('/confirmar-pago/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    inscripcion.pagoConfirmado = true;
    await inscripcion.save();

    enviarCorreoConfirmacion(inscripcion);

    res.status(200).json({ mensaje: '✅ Pago confirmado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar el pago', detalle: error.message });
  }
});

// DELETE - Eliminar todas las inscripciones
router.delete('/', async (req, res) => {
  try {
    await Inscripcion.deleteMany({});
    res.status(200).json({ mensaje: '✅ Todas las inscripciones han sido eliminadas correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar las inscripciones:', error);
    res.status(500).json({ error: '❌ Error al eliminar las inscripciones', detalle: error.message });
  }
});

module.exports = router;