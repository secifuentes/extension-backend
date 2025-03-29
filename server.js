const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Importar rutas
const inscripcionesRoutes = require('./routes/inscripciones');
const cursosRoutes = require('./routes/cursos'); // 👈 nueva línea

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

// Función para enviar correo de bienvenida con estilo HTML
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: inscripcion.correo,
    subject: `¡Bienvenido al curso de ${inscripcion.cursoNombre}! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px; color: #333;">
        <!-- Contenedor Principal -->
        <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
  
          <!-- Encabezado -->
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://via.placeholder.com/150" alt="Logo de la institución" style="width: 150px; border-radius: 50%; margin-bottom: 20px;">
            <h1 style="color: #0078D4; font-size: 28px; font-weight: bold;">¡Felicidades, ${inscripcion.nombres}!</h1>
            <p style="font-size: 16px; color: #555;">¡Ya eres parte del curso de <strong>${inscripcion.cursoNombre}</strong>! 🏆</p>
          </div>

          <!-- Cuerpo del mensaje -->
          <div style="margin-bottom: 30px;">
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              ¡Estamos muy emocionados de que te hayas unido a este curso! 🎉 Tu inscripción está completa y todo está listo para que empieces a disfrutar de esta nueva aventura de aprendizaje. 🎓
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              Tu pago ha sido procesado con éxito. ¡Ya eres oficialmente parte de nuestro curso! 🌟 Ahora solo queda ponerte en acción y disfrutar del contenido que tenemos preparado para ti.
            </p>
          </div>

          <!-- Beneficios -->
          <div style="background-color: #e9f6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #0078D4; font-size: 20px; font-weight: bold; text-align: center;">¡Ventajas y beneficios para ti!</h3>
            <ul style="list-style-type: none; padding: 0; color: #333;">
              <li style="font-size: 16px; padding: 5px 0;"><strong>Descuento Familiar:</strong> ¡Disfruta de un 5% de descuento por ser parte de la familia Presentación!</li>
              <li style="font-size: 16px; padding: 5px 0;"><strong>Pago Trimestral:</strong> Si decides pagar el curso completo, obtendrás un 10% de descuento.</li>
            </ul>
          </div>

          <!-- Acción - Botón -->
          <div style="text-align: center;">
            <a href="https://www.tucursos.com" style="background-color: #0078D4; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 18px; border-radius: 50px; display: inline-block;">Ver detalles del curso</a>
          </div>

          <!-- Redes Sociales -->
          <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
            <p>Síguenos en nuestras redes sociales:</p>
            <div>
              <a href="https://www.facebook.com/tuPagina" style="margin: 0 10px; text-decoration: none; color: #3b5998;">Facebook</a>|
              <a href="https://twitter.com/tuPagina" style="margin: 0 10px; text-decoration: none; color: #1da1f2;">Twitter</a>|
              <a href="https://www.instagram.com/tuPagina" style="margin: 0 10px; text-decoration: none; color: #e1306c;">Instagram</a>
            </div>
          </div>

          <!-- Firma -->
          <div style="margin-top: 40px; text-align: center; color: #777;">
            <p style="font-size: 14px;">¡Nos vemos en clase! 🚀</p>
            <p style="font-size: 14px;">Equipo de Extensión Educativa de La Presentación Girardota</p>
          </div>

        </div>
      </div>
    `,
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al enviar el correo:', error);
    } else {
      console.log('✅ Correo de bienvenida enviado: ' + info.response);
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
app.use('/api/cursos', cursosRoutes); // 👈 nueva línea para rutas de cursos

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