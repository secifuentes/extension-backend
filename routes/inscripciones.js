const express = require('express');
const router = express.Router();
const Inscripcion = require('../models/Inscripcion');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

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
    bcc: 'secifuentes@lapresentaciongirardota.edu.co',
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

const enviarCorreoActualizacion = (inscripcion, cursoAnterior) => {
  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    bcc: 'secifuentes@lapresentaciongirardota.edu.co',
    subject: `${inscripcion.nombres}, ¡HEMOS ACTUALIZADO TU INSCRIPCIÓN!`,
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
            Hemos actualizado tu inscripción 📝
          </p>

          <!-- Detalles -->
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Antes estabas inscrito en el curso: <strong style="color:#d4a017;">“${cursoAnterior}”</strong>.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Ahora estás inscrito en el curso: <strong style="color:#1a428a;">“${inscripcion.cursoNombre}”</strong>.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#555;">
            Si este cambio fue solicitado por ti, ¡todo está perfecto!  
            Si no reconoces esta modificación, contáctanos lo antes posible.
          </p>

          <!-- Banner emocional -->
          <div style="margin:35px 0;padding:25px;background-color:#21145F;border-radius:10px;text-align:center;">
            <p style="font-size:18px;color:#ffffff;font-weight:600;margin:0;">
              Seguimos construyendo juntos esta experiencia que transforma 💙
            </p>
          </div>

          <!-- Botón -->
          <div style="text-align:center;margin-bottom:30px;">
            <a href="https://extensionlapresentacion.com" target="_blank" style="display:inline-block;padding:14px 30px;background-color:#1a428a;color:#fff;text-decoration:none;border-radius:50px;font-size:16px;">
              Visitar plataforma
            </a>
          </div>

          <!-- Cierre -->
          <p style="text-align:center;font-size:15px;color:#555;margin:0;">
            Gracias por ser parte de esta experiencia.
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
      console.log('❌ Error al enviar correo de actualización:', error);
    } else {
      console.log('✅ Correo de actualización enviado:', info.response);
    }
  });
};



const enviarCorreoPagoMensual = (inscripcion, mes) => {
  let titulo = '';
  let mensajePersonalizado = '';

  if (mes === 2) {
    titulo = '¡Confirmamos tu pago del mes 2! 💙';
    mensajePersonalizado = `
      Estás avanzando con firmeza. Tu constancia en este proceso formativo nos inspira.  
      Gracias por seguir construyendo esta experiencia junto a nosotros.
    `;
  } else if (mes === 3) {
    titulo = '¡Tu pago del mes 3 ha sido confirmado! 💙';
    mensajePersonalizado = `
      Has llegado muy lejos en este proceso y eso merece una felicitación.  
      ¡Gracias por tu compromiso y por demostrar que el aprendizaje sí transforma!
    `;
  }

  const mailOptions = {
    from: `"EXTENSIÓN LA PRESENTACIÓN" <${process.env.MAIL_USER}>`,
    to: inscripcion.correo,
    subject: `${inscripcion.nombres}, ¡HEMOS CONFIRMADO TU PAGO DEL MES ${mes}!`,
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
            ${titulo}
          </p>
    
          <!-- Mensaje -->
          <p style="font-size:16px;line-height:1.7;color:#555;">
            ${mensajePersonalizado}
          </p>
    
          <!-- Banner emocional -->
          <div style="margin:35px 0;padding:25px;background-color:#21145F;border-radius:10px;text-align:center;">
            <p style="font-size:18px;color:#ffffff;font-weight:600;margin:0;">
              ¡Seguimos avanzando juntos!<br />
              <span style="color:#4da6ff;">Gracias por tu constancia</span>
            </p>
          </div>
    
          <!-- Botón -->
          <div style="text-align:center;margin-bottom:30px;">
            <a href="https://extensionlapresentacion.com" target="_blank" style="display:inline-block;padding:14px 30px;background-color:#1a428a;color:#fff;text-decoration:none;border-radius:50px;font-size:16px;">
              Ver mi curso
            </a>
          </div>
    
          <!-- Cierre -->
          <p style="text-align:center;font-size:15px;color:#555;margin:0;">
            “Más que cursos, experiencias que inspiran.” 💙
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
    const inscripciones = await Inscripcion.find();

    // Ordenar en memoria
    const ordenadas = inscripciones.sort((a, b) => {
      return new Date(b.fechaInscripcion) - new Date(a.fechaInscripcion);
    });

    console.log("✅ Inscripciones cargadas y ordenadas:", ordenadas.length);
    res.json(ordenadas);
  } catch (error) {
    console.error('❌ Error al obtener inscripciones:', error);
    res.status(500).json({
      error: 'Error al obtener inscripciones',
      detalle: error.message,
    });
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
    if (inscripcion.comprobanteEstado !== 'verificado') {
  inscripcion.comprobanteEstado = 'verificado';
}

// ✅ Limpieza de pagosMensuales incompletos
// ✅ Limpieza más segura (opcional)
if (Array.isArray(inscripcion.pagosMensuales)) {
  inscripcion.pagosMensuales = inscripcion.pagosMensuales.filter(
    (p) => p.mes && typeof p.mes === 'number'
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
    // Verifica si ya existe un pago para ese mes
const pagoExistenteIndex = inscripcion.pagosMensuales.findIndex(p => p.mes === mes);

if (pagoExistenteIndex !== -1) {
  // ✅ Reemplazar solo si el estado es 'rechazado'
  if (inscripcion.pagosMensuales[pagoExistenteIndex].estado === 'rechazado') {
    inscripcion.pagosMensuales[pagoExistenteIndex] = {
      mes,
      comprobante,
      estado: 'pendiente'
    };
  } else {
    return res.status(400).json({ error: `Ya hay un comprobante en estado ${inscripcion.pagosMensuales[pagoExistenteIndex].estado} para el mes ${mes}` });
  }
} else {
  // ✅ Si no existe, lo agrega
  inscripcion.pagosMensuales.push({
    mes,
    comprobante,
    estado: 'pendiente'
  });
}


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

  // 🎯 Diccionario de equivalentes
  const equivalentes = {
    ti: ['TI', 'ti', 'Tarjeta de Identidad'],
    rc: ['RC', 'rc', 'Registro Civil'],
    cc: ['CC', 'cc', 'Cédula de Ciudadanía'],
    ce: ['CE', 'ce', 'Cédula de Extranjería'],
    pa: ['PA', 'pa', 'Pasaporte'],
  };

  // 🧠 Obtener todas las formas posibles para ese tipo
  let posibles = equivalentes[tipo.toLowerCase()] || [tipo];

// 🎯 Si es Registro Civil o Tarjeta de Identidad, buscar ambos
if (posibles.includes('Registro Civil') || posibles.includes('Tarjeta de Identidad')) {
  posibles = ['Registro Civil', 'Tarjeta de Identidad', 'RC', 'TI', 'rc', 'ti'];
}

  try {
    const inscripciones = await Inscripcion.find({
  tipoDocumento: { $in: posibles },
  documento: documento.trim()
});

    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json({ tipo: 'no-encontrado' });
    }

    // El resto del código sigue igual...

    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json({ tipo: 'no-encontrado' });
    }

    // Agrupar la info básica + cursos relacionados
    const estudiante = {
      nombres: inscripciones[0].nombres,
      apellidos: inscripciones[0].apellidos,
      correo: inscripciones[0].correo,
      cursos: inscripciones.map((i) => ({
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

const Estudiante = require('../models/Estudiante'); // Asegúrate de tener esta línea arriba

// ✅ Buscar estudiante con soporte flexible de tipo de documento
router.get('/buscar-estudiante/:tipoDoc/:documento', async (req, res) => {
  const { tipoDoc, documento } = req.params;

  try {
    const docNormalizado = tipoDoc.trim();
    const documentoLimpio = documento.trim();

    // 1️⃣ Búsqueda exacta
    let estudiante = await Estudiante.findOne({
      tipoDocumento: new RegExp(`^${docNormalizado}$`, 'i'),
      documento: documentoLimpio,
    });

    // 2️⃣ Si no se encuentra, probar equivalentes
    if (!estudiante) {
      const equivalentes = {
        'Tarjeta de Identidad': ['Registro Civil'],
        'Registro Civil': ['Tarjeta de Identidad'],
      };

      const alternativas = equivalentes[docNormalizado] || [];

      for (const alternativa of alternativas) {
        estudiante = await Estudiante.findOne({
          tipoDocumento: new RegExp(`^${alternativa}$`, 'i'),
          documento: documentoLimpio,
        });
        if (estudiante) break;
      }
    }

    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (error) {
    console.error('❌ Error en búsqueda de estudiante:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// ✅ PUT - Actualizar datos de inscripción
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const nuevosDatos = req.body;

  try {
    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    const cursoAnterior = inscripcion.cursoNombre;

    // Actualiza los campos editables
    inscripcion.nombres = nuevosDatos.nombres;
    inscripcion.apellidos = nuevosDatos.apellidos;
    inscripcion.correo = nuevosDatos.correo;
    inscripcion.telefono = nuevosDatos.telefono;

    if (nuevosDatos.cursoNombre) {
      inscripcion.cursoNombre = nuevosDatos.cursoNombre;
    }

    await inscripcion.save();

   // Si cambió el curso y el pago ya está confirmado, enviar correo de actualización
if (
  cursoAnterior !== inscripcion.cursoNombre &&
  inscripcion.pagoConfirmado &&
  req.body.enviarCorreo
) {
  console.log('🔁 Curso cambiado, enviando correo de actualización...');
  enviarCorreoActualizacion(inscripcion, cursoAnterior);
}

    res.json({ mensaje: '✅ Información actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar inscripción:', error);
    res.status(500).json({ error: 'Error al actualizar inscripción', detalle: error.message });
  }
});

const User = require('../models/User');

// 📘 Obtener datos de inscripción por usuario (para el panel del estudiante)
router.get('/usuario/:userId', async (req, res) => {
  try {
    const usuario = await User.findById(req.params.userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const inscripciones = await Inscripcion.find({ correo: usuario.email }).sort({ fechaInscripcion: -1 });

    if (!inscripciones || inscripciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron inscripciones para este usuario' });
    }

    // Agrupar la información para el panel
    const resumen = {
      nombre: usuario.nombre,
      email: usuario.email,
      documento: usuario.documento,
      cursos: inscripciones.map((i) => ({
        curso: i.cursoNombre,
        modalidad: i.modalidad || 'Presencial',
        inicio: i.fechaInicio || 'Por confirmar',
        pagoConfirmado: i.pagoConfirmado,
        pagosMensuales: i.pagosMensuales || [],
        materiales: i.materiales || [],
      })),
    };

    res.json(resumen);
  } catch (err) {
    console.error("❌ Error al buscar inscripciones por usuario:", err);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
});

module.exports = router;