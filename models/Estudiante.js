const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
  tipoDocumento: { type: String, required: true },
  documento: { type: String, required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo: { type: String, required: true },
});

module.exports = mongoose.model('Estudiante', EstudianteSchema);