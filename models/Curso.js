const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nombre: String,
  imagen: String,
  modalidad: String,
  duracion: String,
  ubicacion: String,
  horario: String,
  requisitos: String,
  implementos: String,
  beneficios: String,
  edad: String,
  reserva: String,
  descripcion: String,
  precio: Number,
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Curso', CursoSchema);