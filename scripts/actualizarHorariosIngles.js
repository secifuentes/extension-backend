const mongoose = require('mongoose');
const Curso = require('../models/Curso');

const MONGO_URI = 'mongodb+srv://secifuentes:1624Scc%24@cluster0.kun5f.mongodb.net/extension?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('🔌 Conectado a MongoDB');

    const curso = await Curso.findOne({ nombre: 'Inglés para Niños Nivel A1 - A2' });

    if (!curso) {
      console.log('❌ Curso no encontrado');
      mongoose.disconnect();
      return;
    }

    curso.horarios = [
      'Martes y Jueves de 15:00 a 16:00',
      'Lunes y Miércoles de 15:00 a 16:00'
    ];

    await curso.save();
    console.log('✅ Horarios actualizados');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });