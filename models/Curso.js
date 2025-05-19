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
  slug: { type: String, required: true, unique: true },

  // 🔧 Nuevo campo: docente
  docente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // asegúrate que tu modelo de usuario se llama "User"
    required: false // Temporalmente no obligatorio hasta que lo asignemos
  }

}, { timestamps: true });

module.exports = mongoose.model('Curso', CursoSchema);