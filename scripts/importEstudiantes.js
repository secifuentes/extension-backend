const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Estudiante = require('../models/Estudiante');  // Asegúrate de que el modelo esté importado correctamente

console.log("Conectando a MongoDB...");

// Conexión a MongoDB (directamente usando el URI en el código)
mongoose.connect('mongodb+srv://secifuentes:1624Scc%24@cluster0.kun5f.mongodb.net/extension?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Leer el archivo CSV
fs.createReadStream('scripts/estudiantes.csv')  // Asegúrate de que la ruta sea la correcta
  .pipe(csv({ separator: ';' }))  // Usamos punto y coma como separador
  .on('data', async (row) => {
    try {
      // Crear un nuevo estudiante
      const nuevoEstudiante = new Estudiante({
        tipoDocumento: row['TIPO DE DOCUMENTO'],
        documento: row['DOCUMENTO'],
        nombres: row['NOMBRES'],
        apellidos: row['APELLIDOS'],
        correo: row['CORREO'],
      });

      // Guardar el estudiante en la base de datos
      await nuevoEstudiante.save();
      console.log('Estudiante agregado:', nuevoEstudiante);
    } catch (error) {
      console.error('Error al guardar el estudiante:', error);
    }
  })
  .on('end', () => {
    console.log('Archivo CSV procesado exitosamente');
    mongoose.disconnect();  // Desconectar después de procesar el archivo
  });