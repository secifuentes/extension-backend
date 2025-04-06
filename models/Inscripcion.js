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

  formaPago: String, // ✅ <-- ESTA LÍNEA ES CLAVE

  valorPagado: Number,
  pagoConfirmado: { type: Boolean, default: false },
  comprobante: String,
  acudiente: String,
  telefonoAcudiente: String,

  // 🆕 Pagos mensuales adicionales
  pagosMensuales: {
    mes2: {
      comprobante: String,
      confirmado: { type: Boolean, default: false }
    },
    mes3: {
      comprobante: String,
      confirmado: { type: Boolean, default: false }
    }
  },

  fechaInscripcion: { type: Date, default: Date.now }
});

// 🛡️ Índice único para evitar inscripciones duplicadas al mismo curso
InscripcionSchema.index({ documento: 1, cursoId: 1 }, { unique: true });

// Exportar el modelo
module.exports = mongoose.model('Inscripcion', InscripcionSchema);