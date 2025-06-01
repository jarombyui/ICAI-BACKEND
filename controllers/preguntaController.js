import { Pregunta } from '../models/index.js';

// Crear pregunta
export const crearPregunta = async (req, res) => {
  try {
    const { examen_id, texto } = req.body;
    if (!examen_id || !texto) {
      return res.status(400).json({ error: 'Faltan campos requeridos: examen_id, texto' });
    }
    const pregunta = await Pregunta.create({ examen_id, texto });
    res.status(201).json(pregunta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar preguntas de un examen
export const listarPreguntas = async (req, res) => {
  try {
    const { examen_id } = req.query;
    const where = examen_id ? { examen_id } : {};
    const preguntas = await Pregunta.findAll({ where });
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar pregunta
export const actualizarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const pregunta = await Pregunta.findByPk(id);
    if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });
    if (texto) pregunta.texto = texto;
    await pregunta.save();
    res.json(pregunta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar pregunta
export const eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const pregunta = await Pregunta.findByPk(id);
    if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });
    await pregunta.destroy();
    res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 