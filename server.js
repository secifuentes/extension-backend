const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importar rutas
const inscripcionesRoutes = require('./routes/inscripciones');

const app = express();

// Configurar body-parser para permitir cuerpos más grandes
app.use(express.json({ limit: '10mb' }));  // Establece un límite de 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Para datos urlencoded

// Configuración de CORS para permitir solo ciertos orígenes
const allowedOrigins = [
  'http://localhost:5173',
  'https://extension-presentacion.vercel.app',
  /^https:\/\/.*\.vercel\.app$/, // 🟢 acepta previews de Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    const isAllowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o instanceof RegExp && o.test(origin)
    );
  
    if (!origin || isAllowed || origin === 'null') {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para:', origin);
      callback(new Error('No permitido por CORS'));
    }
  }
}));

app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Función para enviar correo de confirmación
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: inscripcion.correo,
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

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });

// Ruta principal para inscripciones
app.use('/api/inscripciones', inscripcionesRoutes);

// Nueva ruta para confirmar el pago
app.post('/api/confirmarPago', async (req, res) => {
  try {
    const { inscripcionId } = req.body; // Se espera que se envíe el ID de la inscripción

    // Buscar la inscripción por ID
    const inscripcion = await Inscripcion.findById(inscripcionId);
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    // Actualizar el estado de pago
    inscripcion.pagoConfirmado = true;
    await inscripcion.save();

    // Enviar el correo de confirmación
    enviarCorreoConfirmacion(inscripcion);

    res.status(200).json({ message: 'Pago confirmado y correo enviado' });
  } catch (err) {
    console.error('Error al confirmar pago:', err);
    res.status(500).json({ message: 'Error al confirmar pago' });
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  const environment = process.env.NODE_ENV === 'production' ? 'Producción (Heroku)' : 'Desarrollo (Localhost)';
  console.log(`🚀 Servidor corriendo en el puerto ${PORT} — Entorno: ${environment}`);
});