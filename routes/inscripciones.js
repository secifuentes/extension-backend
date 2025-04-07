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
    subject: `${inscripcion.nombres}, ¡TE DAMOS LA BIENVENIDA A UNA EXPERIENCIA QUE TRANSFORMA!`,
    html: `
      <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:600px;width:100%;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.06);padding:30px;box-sizing:border-box;">
          
          <!-- Encabezado -->
          <h2 style="text-align:center;color:#21145F;font-size:26px;margin-bottom:20px;">
            ¡Hola <span style="color:#21145F;">${inscripcion.nombres}</span>!
          </h2>
          <p style="text-align:center;font-size:18px;color:#444;margin-bottom:30px;">
            ¡Tu pago ha sido confirmado! 🎉
          </p>

          <!-- Mensaje de bienvenida -->
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Ya haces parte oficialmente del curso <strong style="color:#1a428a;">“${inscripcion.cursoNombre}”</strong> de <strong>Extensión La Presentación</strong>.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Nos alegra muchísimo darte la bienvenida a la <strong style="color:#21145F;">Familia Presentación</strong>, un espacio donde el aprendizaje se convierte en una experiencia emocionante, creativa y transformadora.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Muy pronto recibirás en el correo que registraste toda la información clave: la fecha de inicio, el nombre de tu docente y los pasos que siguen.
          </p>

          <!-- Banner emocional -->
          <div style="margin:35px 0;padding:25px;background-color:#21145F;border-radius:10px;text-align:center;">
            <p style="font-size:18px;color:#ffffff;font-weight:600;margin:0;">
              ¿Te emociona esta nueva etapa?<br />
              <span style="color:#4da6ff;">¡A nosotros nos emociona tenerte aquí!</span>
            </p>
          </div>

          <!-- Botón -->
          <div style="text-align:center;margin-bottom:30px;">
            <a href="https://extensionlapresentacion.com" target="_blank" style="display:inline-block;padding:14px 30px;background-color:#1a428a;color:#fff;text-decoration:none;border-radius:50px;font-size:16px;">
              Ver detalles del curso
            </a>
          </div>

          <!-- Cierre -->
          <p style="text-align:center;font-size:15px;color:#555;margin:0;">
            Gracias por ser parte de esta experiencia. 💙
          </p>
          <p style="text-align:center;font-size:15px;color:#555;font-style:italic;margin-top:20px;">
            <strong>“Más que cursos, experiencias que inspiran.”</strong>
          </p>

          <!-- Firma -->
          <h3 style="text-align:center;color:#21145F;margin-top:40px;font-size:20px;letter-spacing:1px;">
            EQUIPO DE EXTENSIÓN LA PRESENTACIÓN
          </h3>
          <p style="text-align:center;font-size:13px;color:#aaa;">Girardota – Antioquia</p>

          <!-- Redes Sociales -->
          <div style="text-align:center;margin-top:30px;">
            <p style="font-size:15px;font-weight:bold;color:#444;">Síguenos en nuestras redes sociales:</p>
            <p style="font-size:14px;color:#888;line-height:2;margin:10px 0;word-break:break-word;">
              <a href="https://instagram.com/presentaciongirardota" style="color:#d4a017;text-decoration:none;">Instagram</a> |
              <a href="https://www.tiktok.com/@presentaciongirardota" style="color:#d4a017;text-decoration:none;">TikTok</a> |
              <a href="https://www.facebook.com/presentaciondegirardota" style="color:#d4a017;text-decoration:none;">Facebook</a> |
              <a href="https://www.youtube.com/@Presentaciongirardota" style="color:#d4a017;text-decoration:none;">YouTube</a>
            </p>
          </div>
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

const enviarCorreoPagoMensual = (inscripcion, mes) => {
  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: `${inscripcion.nombres}, ¡HEMOS CONFIRMADO TU PAGO DEL MES ${mes}!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px; color: #333;">

          <h2 style="text-align: center; color: #21145F; font-size: 24px; margin-bottom: 10px;">
            ¡Hola <span style="color: #21145F;">${inscripcion.nombres}</span>!
          </h2>

          <p style="text-align: center; font-size: 18px; color: #444;">
            ¡Hemos confirmado tu pago del mes ${mes}!
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #555;">
            Gracias por continuar tu proceso con nosotros. Tu compromiso nos inspira y nos llena de alegría seguir acompañándote.
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #555;">
            En la <strong style="color: #21145F;">Familia Presentación</strong>, vivimos el aprendizaje como una experiencia cercana, creativa y transformadora.
            Seguimos contigo, paso a paso, creando, sintiendo y transformando.
          </p>

          <p style="margin-top: 20px; font-size: 15px; font-style: italic; color: #444;">
            <strong>Más que cursos, experiencias que inspiran.</strong>
          </p>

          <h3 style="text-align: center; color: #21145F; margin-top: 30px; font-size: 20px; letter-spacing: 1px;">
            EXTENSIÓN LA PRESENTACIÓN
          </h3>
          <p style="text-align: center; font-size: 13px; color: #aaa;">Girardota – Antioquia</p>

          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px; font-weight: bold; color: #444;">Síguenos y descubre más:</p>
            <p style="font-size: 14px; color: #888;">
              <a href="https://instagram.com/presentaciongirardota" style="color: #d4a017; text-decoration: none; margin-right: 10px;">Instagram</a> |
              <a href="https://www.tiktok.com/@presentaciongirardota" style="color: #d4a017; text-decoration: none; margin: 0 10px;">TikTok</a> |
              <a href="https://www.facebook.com/presentaciondegirardota" style="color: #d4a017; text-decoration: none; margin: 0 10px;">Facebook</a> |
              <a href="https://www.youtube.com/@Presentaciongirardota" style="color: #d4a017; text-decoration: none; margin-left: 10px;">YouTube</a>
            </p>
          </div>

        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('❌ Error al enviar correo mensual:', error);
    } else {
      console.log('✅ Correo de confirmación mensual enviado:', info.response);
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
    console.log('🛠 Confirmando pago para ID:', req.params.id);

    const inscripcion = await Inscripcion.findById(req.params.id);

    if (!inscripcion) {
      console.warn('❌ Inscripción no encontrada');
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    inscripcion.pagoConfirmado = true;

// ✅ Limpieza de pagosMensuales incompletos
if (Array.isArray(inscripcion.pagosMensuales)) {
  inscripcion.pagosMensuales = inscripcion.pagosMensuales.filter(
    (p) => p.comprobante && p.mes
  );
}

await inscripcion.save();

    if (inscripcion.correo && inscripcion.nombres && inscripcion.cursoNombre) {
      console.log('📤 Enviando correo a:', inscripcion.correo);

      try {
        enviarCorreoConfirmacion(inscripcion);
      } catch (errorCorreo) {
        console.error('❌ Error al enviar correo:', errorCorreo);
        // No detenemos la ejecución si falla el correo
      }
    } else {
      console.warn('⚠️ Datos incompletos para enviar correo:', inscripcion);
    }

    res.status(200).json({ mensaje: '✅ Pago confirmado correctamente' });

  } catch (error) {
    console.error('❌ Error general en confirmar-pago:', error);
    res.status(500).json({ error: 'Error al confirmar el pago', detalle: error.message });
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
  const { mes, comprobante } = req.body; // Usa 'comprobante' directamente
  if (!mes || !comprobante) {
    console.error('🚨 Datos faltantes:', { mes, comprobante });
    return res.status(400).json({ error: 'Faltan datos: mes o comprobante' });
  }

  console.log("🛬 Datos recibidos:", req.body);
  console.log("🔍 DEBUG - mes:", mes, "comprobante:", comprobante?.slice(0, 30));

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
      comprobante, // Usa 'comprobante' directamente, no 'comprobanteBase64'
      estado: 'pendiente'
    });

    await inscripcion.save();

    res.json({ mensaje: `✅ Comprobante del mes ${mes} guardado correctamente.` });
  } catch (error) {
    console.error('❌ Error al guardar comprobante mensual:', error);
    res.status(500).json({ error: 'Error al guardar comprobante', detalle: error.message });
  }
});

// ✅ PUT - Confirmar pago mensual
router.put('/pagos-mensuales/:id/confirmar', async (req, res) => {
  const { id } = req.params;
  const { mes } = req.body;

  try {
    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    const pago = inscripcion.pagosMensuales.find(p => p.mes === mes);
    if (!pago) {
      return res.status(404).json({ error: `No hay comprobante cargado para el mes ${mes}` });
    }

    pago.estado = 'verificado';
    await inscripcion.save();

    // 📬 Enviar correo de confirmación mensual
    enviarCorreoPagoMensual(inscripcion, mes);

    res.json({ mensaje: `✅ Pago del mes ${mes} confirmado correctamente` });
  } catch (error) {
    console.error('❌ Error al confirmar pago mensual:', error);
    res.status(500).json({ error: 'Error al confirmar pago mensual', detalle: error.message });
  }
});



module.exports = router;