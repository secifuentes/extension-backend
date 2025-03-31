require('dotenv').config();  // Asegúrate de que dotenv esté cargado al principio del archivo
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Estudiante = require('../models/Estudiante');  // Asegúrate de que el modelo esté importado correctamente

// Conexión a MongoDB
console.log('Conectando a MongoDB...');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Leer el archivo CSV
fs.createReadStream('scripts/estudiantes.csv')  // Asegúrate de que la ruta sea la correcta
  .pipe(csv({ separator: ';' }))  // Usamos punto y coma como separador (cambia si es otro)
  .on('data', async (row) => {
    try {
      // Imprimir el valor de 'TIPO DE DOCUMENTO' para verificar que lo estamos leyendo
      console.log('Tipo de Documento:', row['TIPO DE DOCUMENTO']); // Esta es la línea que añade depuración

      const nuevoEstudiante = new Estudiante({
        tipoDocumento: row['TIPO DE DOCUMENTO'],  // Valor de 'TIPO DE DOCUMENTO' que estamos procesando
        documento: row['DOCUMENTO'],
        nombres: row['NOMBRES'],
        apellidos: row['APELLIDOS'],
        correo: row['CORREO'],
      });

      // Intentamos guardar el estudiante en la base de datos
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