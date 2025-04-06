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
  comprobante: String,
  acudiente: String, // ✅ agregado
  telefonoAcudiente: String, // ✅ agregado
  fechaInscripcion: { type: Date, default: Date.now }
});

// 🛡️ Índice único para evitar inscripciones duplicadas al mismo curso
InscripcionSchema.index({ documento: 1, cursoId: 1 }, { unique: true });

// Exportar el modelo
module.exports = mongoose.model('Inscripcion', InscripcionSchema);