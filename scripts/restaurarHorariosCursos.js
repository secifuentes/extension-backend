// scripts/restaurarHorariosCursos.js

require('dotenv').config();
const mongoose = require('mongoose');
const Curso = require('../models/Curso');

const MONGO_URI = process.env.MONGO_URI;

const horariosPorCurso = {
  'Iniciación Musical': ['Martes de 15:00 a 16:00'],
  'Iniciación en canto e instrumentos': ['Martes de 16:00 a 17:00'],
  'Ensamble y conjunto musical': ['Jueves de 15:00 a 16:30'],
  'Semillero banda de vientos': ['Jueves de 16:30 a 18:00'],
  'Inglés Juvenil Nivel A1 - A2 (De 12 a 14 años)': ['Lunes y miércoles 16:00 a 17:00'],
  'Inglés para Jóvenes Nivel A1 - A2': ['Martes y Jueves 15:00 a 16:00'],
  'Inglés para Jóvenes Nivel B1 - B2': ['Martes y Jueves 16:00 a 17:00'],
  'Inglés para Adultos Nivel A1 - A2': ['Jueves 17:00 a 18:00'],
  'Defensa Personal con Énfasis en Lucha Olímpica': ['Miércoles de 15:00 a 16:00'],
  'Ajedrez avanzados': ['Sábados 12:00 a 13:00'],
  'Ajedrez para niños': ['Sábados 9:30 a 10:30'],
  'Ajedrez para adultos': ['Sábados 11:00 a 12:00']
};

async function actualizarHorarios() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    for (const [nombre, horarios] of Object.entries(horariosPorCurso)) {
      const curso = await Curso.findOne({ nombre });

      if (!curso) {
        console.warn(`⚠️ Curso no encontrado: ${nombre}`);
        continue;
      }

      curso.horarios = horarios;
      await curso.save();
      console.log(`✅ Horarios actualizados para: ${nombre}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

actualizarHorarios();