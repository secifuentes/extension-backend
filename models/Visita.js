const mongoose = require('mongoose');

// Esquema para registrar visitas al sitio
const visitaSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  pagina: {
    type: String,
    default: 'inicio'
  }
});

module.exports = mongoose.model('Visita', visitaSchema);