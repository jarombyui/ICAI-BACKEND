import { Inscripcion, Curso, Usuario } from '../models/index.js';

export const inscribir = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { curso_id } = req.body;
    if (!curso_id) {
      return res.status(400).json({ error: 'Falta el campo curso_id' });
    }
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

// Listar todas las inscripciones (solo admin)
export const listarTodasInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'nombre', 'apellido', 'email']
        },
        {
          model: Curso,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['id', 'ASC']]
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 