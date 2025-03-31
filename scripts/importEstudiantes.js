const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Estudiante = require('../models/Estudiante');  // Asegúrate de que la ruta sea correcta

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error de conexión a MongoDB', err);
  });

// Lee el archivo CSV desde la carpeta scripts
fs.createReadStream('./estudiantes.csv')  // Asegúrate de que esté en la ruta correcta
  .pipe(csv())
  .on('data', async (row) => {
    try {
      // Crea un nuevo estudiante en la base de datos
      const nuevoEstudiante = new Estudiante({
        tipoDocumento: row['TIPO DE DOCUMENTO'],  // Asegúrate de que las claves coincidan con los encabezados
        documento: row['DOCUMENTO'],
        nombres: row['NOMBRES'],
        apellidos: row['APELLIDOS'],
        correo: row['CORREO'],
      });
      
      await nuevoEstudiante.save();
      console.log('Estudiante agregado:', row['DOCUMENTO']);
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
    }
  })
  .on('end', () => {
    console.log('Archivo CSV procesado');
    mongoose.disconnect();  // Desconectar de MongoDB una vez que el archivo esté procesado
  });