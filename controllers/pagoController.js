import { Pago, Inscripcion, Usuario, Curso } from '../models/index.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const storageComprobante = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), 'uploads', 'comprobantes');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
export const uploadComprobante = multer({ storage: storageComprobante });

export const registrarPago = async (req, res) => {
  try {
    const { inscripcion_id, metodo, monto } = req.body;
    // Si el método es visa, el pago es automático y se marca como completado
    let estadoPago = 'pendiente';
    if (metodo === 'visa') estadoPago = 'completado';
    const pago = await Pago.create({ inscripcion_id, metodo, monto, estado: estadoPago });

    // Cambia el estado de la inscripción a 'comprado' solo si el pago es completado
    if (estadoPago === 'completado') {
      const inscripcion = await Inscripcion.findByPk(inscripcion_id);
      if (inscripcion) {
        inscripcion.estado = 'comprado';
        await inscripcion.save();
      }
    }

    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarPagosPorInscripcion = async (req, res) => {
  try {
    const { inscripcion_id } = req.params;
    const pagos = await Pago.findAll({ where: { inscripcion_id } });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nuevo: Listar todos los pagos con relaciones (solo admin)
export const listarPagosAdmin = async (req, res) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        {
          model: Inscripcion,
          include: [
            { model: Usuario, attributes: ['id', 'nombre', 'apellido', 'email'] },
            { model: Curso, attributes: ['id', 'nombre'] }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const aprobarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'aprobado' o 'rechazado'
    const pago = await Pago.findByPk(id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    pago.estado = estado;
    await pago.save();
    if (estado === 'aprobado') {
      const inscripcion = await Inscripcion.findByPk(pago.inscripcion_id);
      if (inscripcion) {
        inscripcion.estado = 'comprado';
        await inscripcion.save();
      }
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const subirComprobantePago = async (req, res) => {
  try {
    const { pago_id } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const pago = await Pago.findByPk(pago_id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    pago.comprobante_url = `/uploads/comprobantes/${req.file.filename}`;
    pago.estado = 'pendiente';
    await pago.save();
    res.json({ url: pago.comprobante_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 