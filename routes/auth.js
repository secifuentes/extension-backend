// BACKEND - routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const esCorrecta = await user.compararPassword(password);
    if (!esCorrecta) return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      usuario: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

module.exports = router;