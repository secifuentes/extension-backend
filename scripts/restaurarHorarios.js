// scripts/restaurarHorarios.js

const mongoose = require('mongoose');
require('dotenv').config();
const Curso = require('../models/Curso');

const cursosConHorarios = [
  {
    nombre: 'Ajedrez Iniciación',
    horarios: [
      'Martes 13:10 a 14:10',
      'Martes 14:15 a 15:15',
      'Sábado 8:00 a 9:00'
    ]
  },
  {
    nombre: 'Inglés para Niños Nivel A1 - A2',
    horarios: [
      'Lunes y Miércoles de 15:00 a 16:00',
      'Martes y Jueves de 15:00 a 16:00'
    ]
  }
  // Si quieres agregar más cursos aquí, adelante.
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    for (const cursoData of cursosConHorarios) {
      const curso = await Curso.findOne({ nombre: cursoData.nombre });

      if (!curso) {
        console.warn(`⚠️ Curso no encontrado: ${cursoData.nombre}`);
        continue;
      }

      curso.horarios = cursoData.horarios;
      await curso.save();
      console.log(`✅ Horarios actualizados para: ${curso.nombre}`);
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();