const mongoose = require('mongoose');

// Sub-esquema para pagos mensuales
const PagoMensualSchema = new mongoose.Schema({
  mes: {
    type: Number,
    enum: [2, 3], // puedes agregar más si luego hay más meses
    required: true
  },
  comprobante: {
    type: String,
    required: true
  },
  comprobanteEstado: {
    type: String,
    enum: ['pendiente', 'verificado', 'rechazado'],
    default: 'pendiente',
  },
}, { _id: false });

// Esquema de inscripción completo
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

  formaPago: {
    type: String,
    enum: ['mensual', 'trimestral'],
    required: true
  },

  valorPagado: Number,
  pagoConfirmado: { type: Boolean, default: false },
  comprobante: String, // comprobante del primer pago o curso completo
  comprobanteEstado: {
    type: String,
    enum: ['pendiente', 'verificado', 'rechazado'],
    default: 'pendiente',
  },

  acudiente: String,
  telefonoAcudiente: String,

  // 🆕 Nueva estructura de pagos mensuales
  pagosMensuales: [PagoMensualSchema],

  fechaInscripcion: { type: Date, default: Date.now }
});

// 🛡️ Índice único para evitar inscripciones duplicadas al mismo curso
InscripcionSchema.index({ documento: 1, cursoId: 1 }, { unique: true });

// Exportar el modelo
module.exports = mongoose.model('Inscripcion', InscripcionSchema);