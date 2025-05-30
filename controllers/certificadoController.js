import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { Certificado, Usuario, Curso, Inscripcion } from '../models/index.js';

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
    // Carga la plantilla PDF
    const plantillaPath = path.join(process.cwd(), 'modelo-certificado', 'PLANTILLA1__CERTIFICADO.pdf');
    const existingPdfBytes = fs.readFileSync(plantillaPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    // Coordenadas y datos
    const fechaInicioStr = inscripcion.fecha_inicio
      ? new Date(inscripcion.fecha_inicio).toISOString().slice(0, 10)
      : '';
    const fechaFinStr = inscripcion.fecha_fin
      ? new Date(inscripcion.fecha_fin).toISOString().slice(0, 10)
      : '';
    page.drawText(`${usuario.nombre} ${usuario.apellido}`, { x: 328, y: 370, size: 20, font, color: rgb(0, 0, 0) });
    page.drawText(`DNI: ${usuario.dni}`, { x: 328, y: 350, size: 16, font, color: rgb(0, 0, 0) });
    page.drawText(`${curso.nombre}`, { x: 329, y: 265, size: 18, font, color: rgb(0, 0, 0) });
    page.drawText(`${curso.horas} horas académicas`, { x: 294, y: 323, size: 16, font, color: rgb(0, 0, 0) });
    page.drawText(`Desde: ${fechaInicioStr}`, { x: 328, y: 230, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText(`Hasta: ${fechaFinStr}`, { x: 328, y: 210, size: 14, font, color: rgb(0, 0, 0) });
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