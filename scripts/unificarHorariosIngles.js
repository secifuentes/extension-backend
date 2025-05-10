const mongoose = require('mongoose');
const Curso = require('../models/Curso');

const MONGO_URI = 'mongodb+srv://secifuentes:1624Scc%24@cluster0.kun5f.mongodb.net/extension?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const curso = await Curso.findOne({ nombre: 'Inglés para Niños Nivel A1 - A2' });

    if (!curso) {
      console.log('❌ Curso no encontrado');
      return mongoose.disconnect();
    }

    const antiguo = curso.horario;
    if (antiguo && !curso.horarios.includes(antiguo)) {
      curso.horarios.push(antiguo);
    }

    curso.horario = undefined;
    await curso.save();

    console.log('✅ Curso actualizado con ambos horarios');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error al conectar:', err);
  });