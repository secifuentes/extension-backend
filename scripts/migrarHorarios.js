const mongoose = require('mongoose');
const Curso = require('../models/Curso'); // ajusta si tu ruta es diferente

const MONGO_URI = 'mongodb+srv://secifuentes:1624Scc%24@cluster0.kun5f.mongodb.net/extension?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('🔌 Conectado a MongoDB');

    const cursos = await Curso.find({});

    for (let curso of cursos) {
      if (!curso.horarios || curso.horarios.length === 0) {
        if (curso.horario) {
          curso.horarios = [curso.horario];
          curso.horario = undefined; // elimina el campo viejo
          await curso.save();
          console.log(`✅ Curso actualizado: ${curso.nombre}`);
        }
      }
    }

    console.log('🎉 Migración completada');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
  });