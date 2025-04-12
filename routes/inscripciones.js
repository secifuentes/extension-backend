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

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:20px;">
      <img src="https://www.extensionlapresentacion.com/logo_extensionce.jpg" alt="Logo Extensión La Presentación" style="max-width:180px;" />
    </div>

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
  let mensajePersonalizado = '';

  if (mes === 2) {
    mensajePersonalizado = `
      ¡Hola ${inscripcion.nombres}!  
      ¡Confirmamos tu pago del mes 2! 💙

      Estás avanzando con firmeza. Tu constancia en este proceso formativo nos inspira.  
      Gracias por seguir construyendo esta experiencia junto a nosotros.

      _“Más que cursos, experiencias que inspiran.”_

      EQUIPO DE EXTENSIÓN LA PRESENTACIÓN  
      Girardota – Antioquia
    `;
  } else if (mes === 3) {
    mensajePersonalizado = `
      ¡Hola ${inscripcion.nombres}!  
      ¡Tu pago del mes 3 ha sido confirmado! 💙

      Has llegado muy lejos en este proceso y eso merece una felicitación.  
      ¡Gracias por tu compromiso y por demostrar que el aprendizaje sí transforma!

      _“Más que cursos, experiencias que inspiran.”_

      EQUIPO DE EXTENSIÓN LA PRESENTACIÓN  
      Girardota – Antioquia
    `;
  }

  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: `${inscripcion.nombres}, ¡HEMOS CONFIRMADO TU PAGO DEL MES ${mes}!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 30px; color: #333;">
          ${mensajePersonalizado}
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; font-weight: bold; color: #444;">Síguenos en nuestras redes sociales:</p>
            <p style="font-size: 14px; color: #888;">
              <a href="https://instagram.com/presentaciongirardota" style="color: #d4a017; text-decoration: none;">Instagram</a> |
              <a href="https://www.tiktok.com/@presentaciongirardota" style="color: #d4a017; text-decoration: none;">TikTok</a> |
              <a href="https://www.facebook.com/presentaciondegirardota" style="color: #d4a017; text-decoration: none;">Facebook</a> |
              <a href="https://www.youtube.com/@Presentaciongirardota" style="color: #d4a017; text-decoration: none;">YouTube</a>
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
      console.log('✅ Correo mensual enviado:', info.response);
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

// ✅ Ruta para rechazar comprobante y enviar correo de rechazo
router.put('/rechazar-comprobante/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    enviarCorreoRechazo(inscripcion);

    res.json({ mensaje: '📨 Correo de rechazo enviado al estudiante' });
  } catch (error) {
    console.error('❌ Error al rechazar comprobante:', error);
    res.status(500).json({ error: 'Error al procesar el rechazo' });
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

// GET - Consultar estado de inscripción por tipo de documento y número
router.get('/estado/:tipo/:documento', async (req, res) => {
  const { tipo, documento } = req.params;

  console.log('🔍 Consulta recibida:', { tipo, documento });

  try {
    const inscripciones = await Inscripcion.find();

    // Mostrar el primero como ejemplo
    if (inscripciones.length > 0) {
      console.log('📄 Ejemplo:', {
        tipoDocumento: inscripciones[0].tipoDocumento,
        documento: inscripciones[0].documento,
      });
    } else {
      console.log('📭 No hay inscripciones en la BD');
    }

    const coincidencias = inscripciones.filter(i =>
      i.tipoDocumento === tipo && i.documento === documento
    );

    console.log('✅ Coincidencias:', coincidencias.length);

    if (coincidencias.length === 0) {
      return res.status(404).json({ tipo: 'no-encontrado' });
    }

    const estudiante = {
      nombres: coincidencias[0].nombres,
      apellidos: coincidencias[0].apellidos,
      correo: coincidencias[0].correo,
      cursos: coincidencias.map((i) => ({
        _id: i._id,
        cursoNombre: i.cursoNombre,
        formaPago: i.formaPago,
        pagoConfirmado: i.pagoConfirmado,
        valorPagado: i.valorPagado,
        fechaInscripcion: i.fechaInscripcion,
        esEstudiante: i.esEstudiante,
        pagosMensuales: i.pagosMensuales || [],
      })),
    };

    res.json(estudiante);
  } catch (error) {
    console.error('❌ Error en /estado:', error);
    res.status(500).json({ tipo: 'error', detalle: error.message });
  }
});

// ✅ PUT - Editar información del inscrito
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, correo, telefono } = req.body;

  try {
    const actualizado = await Inscripcion.findByIdAndUpdate(
      id,
      { nombres, apellidos, correo, telefono },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Inscripción no encontrada' });
    }

    res.json({ mensaje: '✅ Inscripción actualizada correctamente', datos: actualizado });
  } catch (error) {
    console.error('❌ Error al actualizar inscripción:', error);
    res.status(500).json({ error: 'Error al actualizar inscripción', detalle: error.message });
  }
});

// Función para enviar correo cuando el comprobante fue rechazado
const enviarCorreoRechazo = (inscripcion, mes = null) => {
  const tipoDocAbreviado = mapearTipoDoc(inscripcion.tipoDocumento);
  const linkEstado = `https://www.extensionlapresentacion.com/estado-inscripcion?tipoDoc=${tipoDocAbreviado}&documento=${inscripcion.documento}`;

  const asuntoCorreo = mes 
    ? `${inscripcion.nombres.toUpperCase()}, TU COMPROBANTE DEL MES ${mes} FUE RECHAZADO — ¡ACTUALÍZALO!`
    : `${inscripcion.nombres.toUpperCase()}, TU COMPROBANTE FUE RECHAZADO — ¡ACTUALÍZALO!`;

  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: asuntoCorreo,
    html: `
      <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:600px;width:100%;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.06);padding:30px;box-sizing:border-box;">

          <!-- Logo -->
          <div style="text-align:center;margin-bottom:20px;">
            <img src="https://www.extensionlapresentacion.com/logo_extensionce.jpg" alt="Logo Extensión La Presentación" style="max-width:180px;" />
          </div>

          <!-- Encabezado -->
          <h2 style="text-align:center;color:#c00000;font-size:26px;margin-bottom:20px;">
            ¡Hola <span style="color:#c00000;">${inscripcion.nombres}</span>!
          </h2>
          <p style="text-align:center;font-size:18px;color:#c00000;margin-bottom:30px;">
            Tu comprobante fue rechazado ❌
          </p>

          <!-- Cuerpo -->
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Gracias por inscribirte en el curso <strong style="color:#1a428a;">“${inscripcion.cursoNombre}”</strong>. 
            Hemos revisado el comprobante de pago que enviaste y, lamentablemente, <strong>no pudimos validarlo</strong>.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Solo necesitas <strong>actualizarlo</strong> desde el siguiente enlace:
          </p>

          <!-- Botón -->
          <div style="text-align:center;margin:30px 0;">
            <a href="${linkEstado}" target="_blank" style="display:inline-block;padding:14px 30px;background-color:#1a428a;color:#fff;text-decoration:none;border-radius:50px;font-size:16px;">
              Actualizar comprobante
            </a>
          </div>

          <p style="text-align:center;font-size:15px;color:#c00000;">
          ⚠️ Es muy importante que lo hagas dentro de las próximas 48 horas.
          </p>
          <p style="text-align:center;font-size:15px;color:#c00000;">
          De lo contrario, tu inscripción será eliminada automáticamente y tendrás que empezar el proceso desde cero.
          </p>
          <p style="text-align:center;font-size:15px;color:#555;">
            ¿Tienes dudas? Escríbenos a 
            <a href="mailto:extension@lapresentaciongirardota.edu.co" style="color:#1a428a;font-weight:bold;">
              extension@lapresentaciongirardota.edu.co
            </a>
          </p>

          <!-- Cierre -->
          <p style="text-align:center;font-size:15px;color:#555;margin-top:40px;">
            Gracias por hacer parte de esta experiencia. 💙
          </p>
          <p style="text-align:center;font-size:15px;color:#555;font-style:italic;margin-top:10px;">
            <strong>“Más que cursos, experiencias que inspiran.”</strong>
          </p>

          <!-- Firma -->
          <h3 style="text-align:center;color:#21145F;margin-top:30px;font-size:20px;letter-spacing:1px;">
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
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error al enviar correo de rechazo:', error);
    } else {
      console.log('📨 Correo de rechazo enviado:', info.response);
    }
  });
};

// Función para abreviar tipo de documento
const mapearTipoDoc = (completo) => {
  const map = {
    'Registro Civil': 'rc',
    'Tarjeta de Identidad': 'ti',
    'Cédula de Ciudadanía': 'cc',
    'Cédula de Extranjería': 'ce',
    'Pasaporte': 'pa',
  };
  return map[completo] || 'cc'; // por defecto 'cc'
};


// ✅ Ruta pública para visualizar el comprobante en una ventana
router.get('/ver-comprobante/:id/:mes', async (req, res) => {
  const { id, mes } = req.params;

  try {
    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).send('Inscripción no encontrada');
    }

    const pago = inscripcion.pagosMensuales.find(p => p.mes == mes);

    if (!pago || !pago.comprobante) {
      return res.status(404).send('Comprobante no encontrado');
    }

    const html = `
      <html>
        <head>
          <title>Comprobante del Mes ${mes}</title>
        </head>
        <body style="margin:0;padding:0;">
          <iframe 
            src="data:application/pdf;base64,${pago.comprobante}" 
            style="width:100vw;height:100vh;border:none;">
          </iframe>
        </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('❌ Error al mostrar comprobante:', error);
    res.status(500).send('Error al mostrar comprobante');
  }
});

module.exports = router;