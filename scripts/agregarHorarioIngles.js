const mongoose = require('mongoose');
const Curso = require('../models/Curso');

const MONGO_URI = 'mongodb+srv://secifuentes:1624Scc%24@cluster0.kun5f.mongodb.net/extension?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('🔌 Conectado a MongoDB');

    const curso = await Curso.findOne({ nombre: 'Inglés para Niños Nivel A1 - A2' });

    if (!curso) {
      console.log('❌ Curso no encontrado');
      return mongoose.disconnect();
    }

    const nuevoHorario = 'Martes y Jueves de 15:00 a 16:00';

    if (!curso.horarios.includes(nuevoHorario)) {
      curso.horarios.push(nuevoHorario);
      await curso.save();
      console.log('✅ Horario agregado al curso');
    } else {
      console.log('🔁 El curso ya tenía ese horario');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });