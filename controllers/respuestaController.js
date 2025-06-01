import { Respuesta } from '../models/index.js';

// Crear respuesta
export const crearRespuesta = async (req, res) => {
  try {
    const { pregunta_id, texto, es_correcta } = req.body;
    if (!pregunta_id || !texto || es_correcta === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: pregunta_id, texto, es_correcta' });
    }
    const respuesta = await Respuesta.create({ pregunta_id, texto, es_correcta });
    res.status(201).json(respuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar respuestas de una pregunta
export const listarRespuestas = async (req, res) => {
  try {
    const { pregunta_id } = req.query;
    const where = pregunta_id ? { pregunta_id } : {};
    const respuestas = await Respuesta.findAll({ where });
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar respuesta
export const actualizarRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, es_correcta } = req.body;
    const respuesta = await Respuesta.findByPk(id);
    if (!respuesta) return res.status(404).json({ error: 'Respuesta no encontrada' });
    if (texto) respuesta.texto = texto;
    if (es_correcta !== undefined) respuesta.es_correcta = es_correcta;
    await respuesta.save();
    res.json(respuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar respuesta
export const eliminarRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await Respuesta.findByPk(id);
    if (!respuesta) return res.status(404).json({ error: 'Respuesta no encontrada' });
    await respuesta.destroy();
    res.json({ message: 'Respuesta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 