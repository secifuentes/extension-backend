const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importar las rutas solo una vez
const inscripcionesRoutes = require('./routes/inscripciones');  // Solo esta declaración es suficiente

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usamos Gmail, pero puedes cambiar esto si usas otro servicio
  auth: {
    user: process.env.MAIL_USER,  // Cambia esto por tu correo en el archivo .env
    pass: process.env.MAIL_PASS,  // Cambia esto por tu contraseña en el archivo .env
  },
});

// Función para enviar el correo de confirmación
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: process.env.MAIL_USER,  // Usamos la variable de entorno MAIL_USER
    to: inscripcion.correo,  // El correo del estudiante
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

// Ruta para las inscripciones (esta es la única vez que necesitamos declararla)
app.use('/api/inscripciones', inscripcionesRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const testEmail = () => {
    const mailOptions = {
      from: process.env.MAIL_USER,  // Tu correo
      to: 'sebascifuentesc24@gmail.com', // Cambia esto por tu propio correo o un correo de prueba
      subject: 'Correo de prueba',  // Asunto del correo
      text: 'Este es un correo de prueba para verificar que Nodemailer está funcionando.', // Contenido del correo
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Error al enviar el correo de prueba:', error);
      } else {
        console.log('✅ Correo de prueba enviado: ' + info.response);
      }
    });
  };
  
  // Llama a esta función para probar el envío de correo
  testEmail();