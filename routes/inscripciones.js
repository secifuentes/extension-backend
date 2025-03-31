const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer para el correo de confirmación
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,  // Correo configurado en .env
      pass: process.env.MAIL_PASS,  // Contraseña configurada en .env (o contraseña de aplicación)
    },
  });

// Función para enviar el correo de confirmación
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: process.env.MAIL_USER,  // Ahora se usa el correo configurado en .env
    to: inscripcion.correo, // El correo del estudiante
    subject: 'Confirmación de Inscripción - Curso',
    text: `
      ¡Felicidades, ${inscripcion.nombres} ${inscripcion.apellidos}!

      Tu inscripción al curso de ${inscripcion.cursoNombre} ha sido confirmada.
      Estamos verificando tu pago y te notificaremos pronto.

      ¡Nos vemos en clase! 🎉
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
    // Log para ver los datos que recibimos
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

// Ruta para confirmar el pago
router.put('/confirmar-pago/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    // Confirmar el pago
    inscripcion.pagoConfirmado = true;
    await inscripcion.save();

    // Enviar correo de confirmación
    enviarCorreoConfirmacion(inscripcion);

    res.status(200).json({ mensaje: '✅ Pago confirmado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar el pago', detalle: error.message });
  }
});

// Ruta para eliminar todas las inscripciones
router.delete('/', async (req, res) => {
  try {
    await Inscripcion.deleteMany({});  // Elimina todas las inscripciones de la base de datos
    res.status(200).json({ mensaje: '✅ Todas las inscripciones han sido eliminadas correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar las inscripciones:', error);
    res.status(500).json({ error: '❌ Error al eliminar las inscripciones', detalle: error.message });
  }
});

module.exports = router;