const mongoose = require('mongoose');

// Definir el esquema de inscripción
const InscripcionSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  documento: String,
  tipoDocumento: String,
  correo: String,
  telefono: String,
  fechaNacimiento: Date,
  cursoId: Number,
  cursoNombre: String,
  esEstudiante: Boolean,
  valorPagado: Number,
  pagoConfirmado: { type: Boolean, default: false },
  fechaInscripcion: { type: Date, default: Date.now }
});

// Exportar el modelo
module.exports = mongoose.model('Inscripcion', InscripcionSchema);