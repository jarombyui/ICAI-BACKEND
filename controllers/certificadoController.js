import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { Certificado, Usuario, Curso, Inscripcion, Modulo, Examen, IntentoExamen } from '../models/index.js';

// Función para hacer word wrap
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';
  for (let word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export const emitirCertificado = async (req, res) => {
  try {
    const { usuario_id, curso_id } = req.body;
    // Verifica que el usuario aprobó el curso
    const inscripcion = await Inscripcion.findOne({ where: { usuario_id, curso_id } });
    if (!inscripcion || !inscripcion.fecha_fin) {
      return res.status(400).json({ error: 'El usuario no ha completado el curso' });
    }
    const usuario = await Usuario.findByPk(usuario_id);
    const curso = await Curso.findByPk(curso_id);
    // Obtiene los módulos del curso
    const modulos = await Modulo.findAll({ where: { curso_id }, order: [['orden', 'ASC']] });
    // Obtiene la nota final (promedio de los exámenes aprobados del curso)
    const examenes = await Examen.findAll({ where: { modulo_id: modulos.map(m => m.id) } });
    let notaFinal = null;
    if (examenes.length > 0) {
      const examenesIds = examenes.map(e => e.id);
      const intentos = await IntentoExamen.findAll({ where: { usuario_id, examen_id: examenesIds, aprobado: true } });
      if (intentos.length > 0) {
        // Promedio de los puntajes aprobados
        notaFinal = (intentos.reduce((acc, i) => acc + parseFloat(i.puntaje), 0) / intentos.length).toFixed(2);
      }
    }
    // Carga la plantilla PDF
    const plantillaPath = path.join(process.cwd(), 'modelo-certificado', 'PLANTILLA1__CERTIFICADO.pdf');
    const existingPdfBytes = fs.readFileSync(plantillaPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Elimina todas las páginas excepto la primera (si hay más de una)
    while (pdfDoc.getPageCount() > 1) {
      pdfDoc.removePage(1);
    }

    // Usa la primera página para el certificado
    let page = pdfDoc.getPage(0);
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // Cargar fuente decorativa gótica para 'Certificado'
    const fontGothicPath = path.join(process.cwd(), 'modelo-certificado', 'UnifrakturCook', 'UnifrakturCook-Bold.ttf');
    let fontGothic;
    try {
      const fontGothicBytes = fs.readFileSync(fontGothicPath);
      fontGothic = await pdfDoc.embedFont(fontGothicBytes);
    } catch (e) {
      fontGothic = fontBold;
    }
    // Cargar fuente manuscrita para el nombre del usuario
    const fontScriptPath = path.join(process.cwd(), 'modelo-certificado', 'Great_Vibes', 'GreatVibes-Regular.ttf');
    let fontScript;
    try {
      const fontScriptBytes = fs.readFileSync(fontScriptPath);
      fontScript = await pdfDoc.embedFont(fontScriptBytes);
    } catch (e) {
      fontScript = fontBold;
    }
    // Colores y tamaños
    const gold = rgb(0.72, 0.53, 0.04); // Dorado oscuro y elegante
    const goldLight = rgb(0.95, 0.8, 0.3); // Dorado claro para brillo/reflejo
    const negro = rgb(0, 0, 0);
    // Margen lateral de 30mm a cada lado
    const mmToPt = mm => mm * 2.83465;
    const marginX = mmToPt(30);
    const usableWidth = pageWidth - 2 * marginX;
    // Subir el bloque 30mm
    let currentY = (pageHeight * 2 / 3) + mmToPt(30);
    // Tamaños y line-height
    const sizeCertificado = 38;
    const sizeOtorgado = 18;
    const sizeNombre = 32;
    const sizeParrafo = 14;
    const sizeCurso = 18;
    const lineHeight = sizeParrafo * 1.5;
    // 1. "Certificado" (grande, dorado, gótica, con efecto brillo)
    // Sombra/brillo
    page.drawText('Certificado', {
      x: marginX + usableWidth / 2 - fontGothic.widthOfTextAtSize('Certificado', sizeCertificado) / 2 + 1,
      y: currentY - 1,
      size: sizeCertificado,
      font: fontGothic,
      color: goldLight,
      maxWidth: usableWidth,
    });
    // Texto principal
    page.drawText('Certificado', {
      x: marginX + usableWidth / 2 - fontGothic.widthOfTextAtSize('Certificado', sizeCertificado) / 2,
      y: currentY,
      size: sizeCertificado,
      font: fontGothic,
      color: gold,
      maxWidth: usableWidth,
    });
    currentY -= sizeCertificado * 1.2;
    // 2. "Otorgado a:" (normal, negro, subido y con más espacio abajo)
    currentY += lineHeight * 0.5; // SUBE "Otorgado a:" un poco más arriba
    page.drawText('Otorgado a :', {
      x: marginX + usableWidth / 2 - font.widthOfTextAtSize('Otorgado a :', sizeOtorgado) / 2,
      y: currentY,
      size: sizeOtorgado,
      font,
      color: negro,
      maxWidth: usableWidth,
    });
    currentY -= sizeOtorgado * 1.2 + lineHeight * 1.2; // MÁS ESPACIO ANTES DEL NOMBRE
    // 3. Nombre (grande, dorado, gótica, con efecto brillo)
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
    // Sombra/brillo
    page.drawText(nombreCompleto, {
      x: marginX + usableWidth / 2 - fontGothic.widthOfTextAtSize(nombreCompleto, sizeNombre) / 2 + 1,
      y: currentY - 1,
      size: sizeNombre,
      font: fontGothic,
      color: goldLight,
      maxWidth: usableWidth,
    });
    // Texto principal
    page.drawText(nombreCompleto, {
      x: marginX + usableWidth / 2 - fontGothic.widthOfTextAtSize(nombreCompleto, sizeNombre) / 2,
      y: currentY,
      size: sizeNombre,
      font: fontGothic,
      color: gold,
      maxWidth: usableWidth,
    });
    currentY -= sizeNombre * 1.5;
    // 4. Bloques de texto con word wrap y line-height
    const fechaInicioStr = inscripcion.fecha_inicio ? new Date(inscripcion.fecha_inicio).toLocaleDateString() : '';
    const fechaFinStr = inscripcion.fecha_fin ? new Date(inscripcion.fecha_fin).toLocaleDateString() : '';
    const fechaActual = new Date().toLocaleDateString();
    // Bloques
    const bloque1 = `Identificado(a) con DNI ${usuario.dni} Por haber completado y aprobado satisfactoriamente el Curso de Especialización en:`;
    const bloque2 = curso.nombre; // nombre del curso, negrita, más grande
    const bloque3 = `organizado por el Instituto de Ciencias Administrativas e Ingeniería Aplicadas y El Instituto Americano de Ciencias Aplicadas, realizado del ${fechaInicioStr} al ${fechaFinStr} de 2025 con una duración de ${curso.horas} horas académicas.`;
    const bloque6 = `Lima, ${fechaActual}`;
    // 5. Bloque 1 (normal, word wrap)
    for (const linea of wrapText(bloque1, font, sizeParrafo, usableWidth)) {
      page.drawText(linea, {
        x: marginX + usableWidth / 2 - font.widthOfTextAtSize(linea, sizeParrafo) / 2,
        y: currentY,
        size: sizeParrafo,
        font,
        color: negro,
        maxWidth: usableWidth,
      });
      currentY -= lineHeight;
    }
    // 6. Nombre del curso (negrita, grande, más espacio antes y después)
    currentY -= lineHeight * 0.5;
    page.drawText(bloque2, {
      x: marginX + usableWidth / 2 - fontBold.widthOfTextAtSize(bloque2, sizeCurso) / 2,
      y: currentY,
      size: sizeCurso,
      font: fontBold,
      color: negro,
      maxWidth: usableWidth,
    });
    currentY -= sizeCurso * 1.2 + lineHeight * 0.5;
    // 7. Bloque 3 (normal, word wrap)
    for (const linea of wrapText(bloque3, font, sizeParrafo, usableWidth)) {
      page.drawText(linea, {
        x: marginX + usableWidth / 2 - font.widthOfTextAtSize(linea, sizeParrafo) / 2,
        y: currentY,
        size: sizeParrafo,
        font,
        color: negro,
        maxWidth: usableWidth,
      });
      currentY -= lineHeight;
    }
    // 9. Ciudad y fecha
    page.drawText(bloque6, {
      x: marginX + usableWidth / 2 - font.widthOfTextAtSize(bloque6, sizeParrafo) / 2,
      y: currentY,
      size: sizeParrafo,
      font,
      color: negro,
      maxWidth: usableWidth,
    });

    // SEGUNDA HOJA: Contenido del programa
    const secondPage = pdfDoc.addPage([pageWidth, pageHeight]);
    const { width: pageWidth2, height: pageHeight2 } = secondPage.getSize();
    const marginX2 = mmToPt(100);
    const usableWidth2 = pageWidth2 - 2 * marginX2;
    let ySecond = pageHeight2 - mmToPt(30); // 30mm desde arriba
    const sizeTituloContenido = 22;
    const sizeModulo = 16;
    const sizeSubtitulo = 16;
    const sizeDato = 14;
    const lineHeight2 = sizeDato * 1.5;
    // Título "Contenido del programa:"
    secondPage.drawText('Contenido del programa:', {
      x: marginX2 + usableWidth2 / 2 - fontBold.widthOfTextAtSize('Contenido del programa:', sizeTituloContenido) / 2,
      y: ySecond,
      size: sizeTituloContenido,
      font: fontBold,
      color: negro,
      maxWidth: usableWidth2,
    });
    ySecond -= sizeTituloContenido * 1.7;
    // Nota final
    if (notaFinal) {
      const notaStr = `Nota final: ${notaFinal}`;
      for (const linea of wrapText(notaStr, font, sizeDato, usableWidth2)) {
        secondPage.drawText(linea, {
          x: marginX2 + usableWidth2 / 2 - font.widthOfTextAtSize(linea, sizeDato) / 2,
          y: ySecond,
          size: sizeDato,
          font,
          color: negro,
          maxWidth: usableWidth2,
        });
        ySecond -= lineHeight2;
      }
    }
    // Subtítulo MODULOS :
    secondPage.drawText('MODULOS :', {
      x: marginX2 + usableWidth2 / 2 - fontBold.widthOfTextAtSize('MODULOS :', sizeSubtitulo) / 2,
      y: ySecond,
      size: sizeSubtitulo,
      font: fontBold,
      color: negro,
      maxWidth: usableWidth2,
    });
    ySecond -= sizeSubtitulo * 1.5;
    // Listar nombres de módulos (uno por línea)
    modulos.forEach((modulo) => {
      for (const linea of wrapText(modulo.nombre, font, sizeModulo, usableWidth2)) {
        secondPage.drawText(linea, {
          x: marginX2 + usableWidth2 / 2 - font.widthOfTextAtSize(linea, sizeModulo) / 2,
          y: ySecond,
          size: sizeModulo,
          font,
          color: negro,
          maxWidth: usableWidth2,
        });
        ySecond -= sizeModulo * 1.5;
      }
    });
    // Subtítulo Datos academicos
    ySecond -= sizeSubtitulo * 0.7;
    secondPage.drawText('Datos academicos', {
      x: marginX2 + usableWidth2 / 2 - fontBold.widthOfTextAtSize('Datos academicos', sizeSubtitulo) / 2,
      y: ySecond,
      size: sizeSubtitulo,
      font: fontBold,
      color: negro,
      maxWidth: usableWidth2,
    });
    ySecond -= sizeSubtitulo * 1.3;
    // ID de certificado (placeholder, puedes reemplazar por el real si lo tienes)
    const idCertificado = 'XXXSXSXSXSX';
    const idStr = `ID de certificado: ${idCertificado}`;
    for (const linea of wrapText(idStr, font, sizeDato, usableWidth2)) {
      secondPage.drawText(linea, {
        x: marginX2 + usableWidth2 / 2 - font.widthOfTextAtSize(linea, sizeDato) / 2,
        y: ySecond,
        size: sizeDato,
        font,
        color: negro,
        maxWidth: usableWidth2,
      });
      ySecond -= lineHeight2;
    }

    // Guarda el PDF generado
    const pdfBytes = await pdfDoc.save();
    const outputDir = path.join(process.cwd(), 'certificados');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const outputPath = path.join(outputDir, `certificado_${usuario_id}_${curso_id}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);
    // Registra el certificado en la base de datos
    const url_pdf = `/certificados/certificado_${usuario_id}_${curso_id}.pdf`;
    await Certificado.create({
      usuario_id,
      curso_id,
      url_pdf,
      horas: curso.horas
    });
    res.json({ url_pdf });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todos los certificados (solo admin)
export const listarCertificados = async (req, res) => {
  try {
    const certificados = await Certificado.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'email', 'dni']
        },
        {
          model: Curso,
          attributes: ['id', 'nombre', 'horas']
        }
      ],
      order: [['fecha_emision', 'DESC']]
    });

    res.json(certificados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar certificados de un usuario específico
export const listarCertificadosUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const certificados = await Certificado.findAll({
      where: { usuario_id: id },
      include: [
        {
          model: Curso,
          attributes: ['id', 'nombre', 'horas']
        }
      ],
      order: [['fecha_emision', 'DESC']]
    });

    res.json(certificados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validar un certificado por ID
export const validarCertificado = async (req, res) => {
  try {
    const { id } = req.params;
    
    const certificado = await Certificado.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'dni']
        },
        {
          model: Curso,
          attributes: ['id', 'nombre', 'horas']
        }
      ]
    });

    if (!certificado) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }

    res.json({
      valido: true,
      certificado: {
        id: certificado.id,
        fecha_emision: certificado.fecha_emision,
        usuario: {
          nombre: certificado.usuario.nombre,
          apellido: certificado.usuario.apellido,
          dni: certificado.usuario.dni
        },
        curso: {
          nombre: certificado.curso.nombre,
          horas: certificado.curso.horas
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 