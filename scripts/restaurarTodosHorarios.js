// scripts/restaurarTodosHorarios.js
const mongoose = require('mongoose');
const Curso = require('../models/Curso');

const MONGO_URI = process.env.MONGO_URI || 'TU_URI_AQUI';

const datos = [
  {
    nombre: 'Ajedrez Iniciación',
    horarios: [
      'Lunes y Miércoles 15:00 a 16:00',
      'Martes y Jueves 15:00 a 16:00'
    ]
  },
  {
    nombre: 'Inglés para Niños Nivel A1 - A2',
    horarios: [
      'Lunes y Miércoles 15:00 a 16:00',
      'Martes y Jueves 15:00 a 16:00'
    ]
  },
  {
    nombre: 'Iniciación Musical',
    horarios: ['Viernes 14:00 a 16:00']
  },
  {
    nombre: 'Defensa Personal con Énfasis en Lucha Olímpica',
    horarios: ['Sábado 08:00 a 10:00']
  },
  // Agrega los demás cursos que identificaste aquí
];

async function restaurar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    for (const item of datos) {
      const res = await Curso.updateOne(
        { nombre: item.nombre },
        { $set: { horarios: item.horarios } }
      );
      if (res.modifiedCount > 0) {
        console.log(`✅ Restaurado: ${item.nombre}`);
      } else {
        console.log(`⚠️ No se encontró: ${item.nombre}`);
      }
    }

    await mongoose.disconnect();
    console.log('🔌 Desconectado');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

restaurar();