// scripts/verCursosSinHorarios.js

const mongoose = require('mongoose');
require('dotenv').config();
const Curso = require('../models/Curso');

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const cursos = await Curso.find({
      $or: [
        { horarios: { $exists: false } },
        { horarios: { $size: 0 } }
      ]
    });

    console.log('\n📋 Cursos sin horarios o vacíos:');
    cursos.forEach(c => {
      console.log(`- ${c.nombre}`);
    });

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();