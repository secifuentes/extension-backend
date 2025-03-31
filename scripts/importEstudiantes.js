const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Estudiante = require('../models/Estudiante');  // El modelo de Estudiante
require('dotenv').config();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((err) => console.log('Error al conectar a MongoDB', err));

// Leer el archivo CSV y agregar los estudiantes a la base de datos
const estudiantes = [];

fs.createReadStream('estudiantes.csv')  // Asegúrate de que el archivo esté en el directorio correcto
  .pipe(csv())
  .on('data', (row) => {
    estudiantes.push({
      tipoDocumento: row['TIPO DE DOCUMENTO'],
      documento: row['DOCUMENTO'],
      nombres: row['NOMBRES'],
      apellidos: row['APELLIDOS'],
      correo: row['CORREO'],
    });
  })
  .on('end', async () => {
    console.log('Archivo CSV leído correctamente');
    
    // Insertar los datos en MongoDB
    try {
      await Estudiante.insertMany(estudiantes);
      console.log('Estudiantes importados con éxito');
    } catch (err) {
      console.error('Error al insertar estudiantes:', err);
    }
  });