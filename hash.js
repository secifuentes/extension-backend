const bcrypt = require('bcrypt');

const run = async () => {
  const hash = await bcrypt.hash("123456", 10);
  console.log("Contraseña hasheada:", hash);
};

run();