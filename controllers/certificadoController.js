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
    const nombresModulos = modulos.map(m => m.nombre).join(', ');
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
    const page = pdfDoc.getPages()[0];
    const { width: pageWidth, height: pageHeight } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // Colores y tamaños
    const gold = rgb(0.85, 0.65, 0.13);
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
    // 1. "Certificado" (grande, dorado)
    page.drawText('Certificado', {
      x: marginX + usableWidth / 2 - fontBold.widthOfTextAtSize('Certificado', sizeCertificado) / 2,
      y: currentY,
      size: sizeCertificado,
      font: fontBold,
      color: gold,
      maxWidth: usableWidth,
    });
    currentY -= sizeCertificado * 1.2;
    // 2. "Otorgado a:" (normal, negro)
    page.drawText('Otorgado a :', {
      x: marginX + usableWidth / 2 - font.widthOfTextAtSize('Otorgado a :', sizeOtorgado) / 2,
      y: currentY,
      size: sizeOtorgado,
      font,
      color: negro,
      maxWidth: usableWidth,
    });
    currentY -= sizeOtorgado * 1.2;
    // 3. Nombre (grande, dorado)
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
    page.drawText(nombreCompleto, {
      x: marginX + usableWidth / 2 - fontBold.widthOfTextAtSize(nombreCompleto, sizeNombre) / 2,
      y: currentY,
      size: sizeNombre,
      font: fontBold,
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
    const bloque4 = notaFinal ? `Nota final: ${notaFinal}` : '';
    const bloque5 = nombresModulos ? `Módulos: ${nombresModulos}` : '';
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
    // 8. Nota final y módulos (igual)
    if (bloque4) {
      for (const linea of wrapText(bloque4, font, sizeParrafo, usableWidth)) {
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
    }
    if (bloque5) {
      for (const linea of wrapText(bloque5, font, sizeParrafo, usableWidth)) {
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