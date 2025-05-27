import { Pago, Inscripcion } from '../models/index.js';

export const registrarPago = async (req, res) => {
  try {
    const { inscripcion_id, metodo, monto } = req.body;
    const pago = await Pago.create({ inscripcion_id, metodo, monto, estado: 'completado' });

    // Cambia el estado de la inscripción a "comprado"
    const inscripcion = await Inscripcion.findByPk(inscripcion_id);
    if (inscripcion) {
      inscripcion.estado = 'comprado';
      await inscripcion.save();
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