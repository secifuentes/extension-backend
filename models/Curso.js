const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: Number,
  imagen: String,
  modalidad: String,
  duracion: String,
  ubicacion: String,
  descripcion: String,
  requisitos: String,
  implementos: String,
  beneficios: String,
  edad: String,
  reserva: String,
  horarios: {
    type: [String],
    default: []
  },

  slug: { type: String, required: true, unique: true }, // ✅ este campo
}, { timestamps: true });

module.exports = mongoose.model('Curso', CursoSchema);