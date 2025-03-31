const fs = require('fs');
const path = require('path');

// Cargar el archivo JSON original
const raw = require('../data/extension.estudiantes.json'); // ajusta el path si está en otra carpeta

// Transformar los datos
const cleaned = raw.map(e => ({
  tipoDocumento: (e["TIPO DE DOCUMENTO"] || '').trim(),
  documento: String(e["DOCUMENTO"] || '').trim(),
  nombres: (e["NOMBRES"] || '').trim().toUpperCase(),
  apellidos: (e["APELLIDOS"] || '').trim().toUpperCase(),
  correo: (e["CORREO"] || '').trim().toLowerCase()
}));

// Guardar nuevo archivo
fs.writeFileSync(
  path.join(__dirname, 'estudiantes-limpios.json'),
  JSON.stringify(cleaned, null, 2)
);

console.log('✅ Archivo limpio generado: estudiantes-limpios.json');