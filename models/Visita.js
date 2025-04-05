const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  ip: String,
  fecha: { type: Date, default: Date.now },
  pagina: String, // opcional, por si querés registrar qué página visitaron
});

module.exports = mongoose.model('Visita', visitaSchema);