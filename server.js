const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importar rutas
const inscripcionesRoutes = require('./routes/inscripciones');

const app = express();

// Configuración de CORS para permitir solo ciertos orígenes
const allowedOrigins = [
  'http://localhost:5173',
  'https://extension-presentacion.vercel.app', // dominio del frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin === 'null') {
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

// Puerto del servidor
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  const environment = process.env.NODE_ENV === 'production' ? 'Producción (Heroku)' : 'Desarrollo (Localhost)';
  console.log(`🚀 Servidor corriendo en el puerto ${PORT} — Entorno: ${environment}`);
});

// Función para probar envío de correo
const testEmail = () => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: 'sebascifuentesc24@gmail.com',
    subject: 'Correo de prueba',
    text: 'Este es un correo de prueba para verificar que Nodemailer está funcionando.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al enviar el correo de prueba:', error);
    } else {
      console.log('✅ Correo de prueba enviado: ' + info.response);
    }
  });
};

// Ejecuta una vez para probar correo
testEmail();