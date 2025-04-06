const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✉️ Función para enviar el correo al estudiante
const enviarCorreoConfirmacion = (inscripcion) => {
  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: `${inscripcion.nombres}, TE DAMOS LA BIENVENIDA AL CURSO "${inscripcion.cursoNombre}" DE EXTENSIÓN LA PRESENTACIÓN`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px; color: #333;">
          
          <h2 style="text-align: center; color: #21145F; font-size: 24px; margin-bottom: 10px;">
            ¡Hola <span style="color: #21145F;">${inscripcion.nombres}</span>! 👋
          </h2>

          <p style="text-align: center; font-size: 18px; color: #444; margin-top: 0;">
            Te damos la bienvenida al curso <strong style="color: #1a428a;">"${inscripcion.cursoNombre}"</strong> 💼
          </p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

          <p style="font-size: 16px; line-height: 1.7; color: #555;">
            Nos alegra muchísimo tenerte con nosotros en este camino de aprendizaje. 
            Ahora formas parte de la familia de <strong style="color: #21145F;">EXTENSIÓN LA PRESENTACIÓN</strong>, donde juntos 
            <strong style="color: #d4a017;">Creamos, Sentimos y Transformamos</strong>.
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #fef8e7; border-left: 5px solid #d4a017; border-radius: 5px; font-size: 15px; color: #5a4e26;">
            📬 Tu docente asignado se comunicará contigo muy pronto a través de este medio con toda la información necesaria. 
            <br />Por favor, mantente atento(a) a tu correo.
          </div>

          <p style="font-size: 15px; color: #555;">
            Gracias por elegirnos para seguir creciendo. Este es solo el comienzo de una experiencia maravillosa. 
            ¡Nos emociona acompañarte!
          </p>

          <h3 style="text-align: center; color: #21145F; margin-top: 30px; font-size: 20px; letter-spacing: 1px;">
            EXTENSIÓN LA PRESENTACIÓN
          </h3>
          <p style="text-align: center; font-size: 13px; color: #aaa;">Girardota - Antioquia</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al enviar el correo:', error);
    } else {
      console.log('✅ Correo de confirmación enviado: ' + info.response);
    }
  });
};

// 📬 Función para notificar al administrador
const notificarAdmin = (inscripcion) => {
  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: 'extension@lapresentaciongirardota.edu.co', // 🔁 Cambia esto al correo real del admin
    subject: `📥 Nueva inscripción: ${inscripcion.nombres} al curso "${inscripcion.cursoNombre}"`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #21145F;">📋 Nueva inscripción recibida</h2>
          <p><strong>Nombre completo:</strong> ${inscripcion.nombres} ${inscripcion.apellidos}</p>
          <p><strong>Correo electrónico:</strong> ${inscripcion.correo}</p>
          <p><strong>Curso inscrito:</strong> <span style="color: #1a428a;">${inscripcion.cursoNombre}</span></p>
          <p><strong>Forma de pago:</strong> ${inscripcion.formaPago}</p>
          <p><strong>Fecha de inscripción:</strong> ${new Date(inscripcion.fechaInscripcion).toLocaleString()}</p>
          <hr />
          <p style="color: #666;">Este mensaje fue generado automáticamente por el sistema de inscripción.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al notificar al admin:', error);
    } else {
      console.log('📨 Notificación enviada al admin:', info.response);
    }
  });
};

// POST - Guardar nueva inscripción
router.post('/', async (req, res) => {
  try {
    console.log("Datos recibidos para inscripción: ", req.body);

    // 🛡️ Validar si ya existe inscripción con ese documento y curso
    const yaExiste = await Inscripcion.findOne({
      documento: req.body.documento,
      cursoId: req.body.cursoId,
    });

    if (yaExiste) {
      return res.status(409).json({ mensaje: '⚠️ Ya estás inscrito en este curso' });
    }

    // ✅ Crear la nueva inscripción
    const nueva = new Inscripcion(req.body);
    await nueva.save();

    // Notificar al admin (si tienes la función notificarAdmin configurada)
    if (typeof notificarAdmin === 'function') {
      notificarAdmin(nueva);
    }

    res.status(201).json({ mensaje: '✅ Inscripción guardada correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar inscripción:', error);
    res.status(500).json({ error: 'Error al guardar inscripción', detalle: error.message });
  }
});

// Resto de rutas (sin cambios)
router.get('/', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find().sort({ fechaInscripcion: -1 });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

router.put('/confirmar-pago/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    inscripcion.pagoConfirmado = true;
    await inscripcion.save();

    enviarCorreoConfirmacion(inscripcion);

    res.status(200).json({ mensaje: '✅ Pago confirmado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al confirmar el pago', detalle: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Inscripcion.deleteMany({});
    res.status(200).json({ mensaje: '✅ Todas las inscripciones han sido eliminadas correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar las inscripciones:', error);
    res.status(500).json({ error: '❌ Error al eliminar las inscripciones', detalle: error.message });
  }
});

router.get('/estado/:tipoDoc/:documento', async (req, res) => {
  const { tipoDoc, documento } = req.params;

  try {
    const inscripciones = await Inscripcion.find({
      tipoDocumento: new RegExp(`^${tipoDoc}$`, 'i'),
      documento: documento,
    });

    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json({ tipo: 'no-encontrado' });
    }

    const estudiante = {
      nombres: inscripciones[0].nombres,
      apellidos: inscripciones[0].apellidos,
      correo: inscripciones[0].correo,
      cursos: inscripciones.map(ins => ({
        _id: ins._id,
        cursoNombre: ins.cursoNombre,
        formaPago: ins.formaPago,
        pagoConfirmado: ins.pagoConfirmado,
        fechaInscripcion: ins.fechaInscripcion,
        valorPagado: ins.valorPagado, // ✅ AGREGA ESTA LÍNEA
        pagosMensuales: ins.pagosMensuales || [],
        esEstudiante: ins.esEstudiante
      })),
    };

    res.json(estudiante);
  } catch (err) {
    console.error('❌ Error al consultar inscripciones:', err);
    res.status(500).json({ tipo: 'error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Inscripcion.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }

    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar inscripción:', error);
    res.status(500).json({ message: 'Error del servidor al eliminar' });
  }
});

// ✅ PUT - Guardar comprobantes de pago mensual (mes 2 o mes 3)
router.put('/pagos-mensuales/:id', async (req, res) => {
  const { id } = req.params;
  const { mes, comprobanteBase64 } = req.body;

  // Validar que el mes sea 2 o 3 (puedes ampliar en el futuro si hay más)
  if (![2, 3].includes(mes)) {
    return res.status(400).json({ error: 'Mes inválido (solo se permite 2 o 3)' });
  }

  try {
    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    // Verificar si ya hay comprobante para ese mes
    const yaExiste = inscripcion.pagosMensuales.find(p => p.mes === mes);
    if (yaExiste) {
      return res.status(400).json({ error: `Ya se subió un comprobante para el mes ${mes}` });
    }

    // Agregar nuevo pago mensual
    inscripcion.pagosMensuales.push({
      mes,
      comprobante: comprobanteBase64,
      estado: 'pendiente'
    });

    await inscripcion.save();

    res.json({ mensaje: `✅ Comprobante del mes ${mes} guardado correctamente.` });
  } catch (error) {
    console.error('❌ Error al guardar comprobante mensual:', error);
    res.status(500).json({ error: 'Error al guardar comprobante', detalle: error.message });
  }
});



module.exports = router;