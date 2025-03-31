require('dotenv').config();
const mongoose = require('mongoose');
const Estudiante = require('../models/Estudiante');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('✅ Conectado a Mongo');

    const estudiantes = await Estudiante.find();

    for (const est of estudiantes) {
      est.tipoDocumento = est.tipoDocumento.trim();
      est.documento = est.documento.trim();
      est.nombres = est.nombres.trim().toUpperCase();       // ✅ MAYÚSCULAS
      est.apellidos = est.apellidos.trim().toUpperCase();   // ✅ MAYÚSCULAS
      est.correo = est.correo.trim().toLowerCase();

      await est.save();
    }

    console.log('✅ Todos los estudiantes han sido limpiados correctamente');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error al conectar a Mongo:', err);
  });