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
  cursoId: String,
  cursoNombre: String,
  esEstudiante: Boolean,
  valorPagado: Number,
  pagoConfirmado: { type: Boolean, default: false },
  comprobante: String, // 👈 nueva línea para almacenar el base64
  fechaInscripcion: { type: Date, default: Date.now }
});

// Exportar el modelo
module.exports = mongoose.model('Inscripcion', InscripcionSchema);