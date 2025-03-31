require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Estudiante = require('../models/Estudiante');

// Conectarse a Mongo
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('✅ Conectado a MongoDB');

    const raw = fs.readFileSync(path.join(__dirname, 'estudiantes-limpios.json'));
    const estudiantes = JSON.parse(raw);

    // Opcional: eliminar los que ya estaban
    await Estudiante.deleteMany();

    await Estudiante.insertMany(estudiantes);

    console.log('✅ Estudiantes cargados exitosamente');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error al cargar estudiantes:', err);
  });