import { Inscripcion, Curso } from '../models/index.js';

export const inscribir = async (req, res) => {
  try {
    const { usuario_id, curso_id } = req.body;
    const inscripcion = await Inscripcion.create({ usuario_id, curso_id });
    res.status(201).json(inscripcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarInscripcionesUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const inscripciones = await Inscripcion.findAll({
      where: { usuario_id },
      include: [{ model: Curso }],
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findByPk(id);
    if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
    await inscripcion.destroy();
    res.json({ message: 'Inscripción eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 