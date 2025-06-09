import { Inscripcion, Curso, Usuario, sequelize } from '../models/index.js';
import Certificado from '../models/certificado.js';
import IntentoExamen from '../models/intentoExamen.js';
import Pago from '../models/pago.js';

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

    // Eliminar certificados del usuario para ese curso
    await Certificado.destroy({ where: { usuario_id: inscripcion.usuario_id, curso_id: inscripcion.curso_id } });

    // Eliminar intentos de exámenes del usuario para ese curso
    await IntentoExamen.destroy({
      where: {
        usuario_id: inscripcion.usuario_id,
        // Filtrar por exámenes de ese curso
        examen_id: (sequelize.literal(`examen_id IN (SELECT id FROM examen WHERE modulo_id IN (SELECT id FROM modulo WHERE curso_id = ${inscripcion.curso_id}))`))
      }
    });

    // Eliminar pagos asociados a la inscripción
    await Pago.destroy({ where: { inscripcion_id: inscripcion.id } });

    await inscripcion.destroy();
    res.json({ message: 'Inscripción eliminada' });
  } catch (error) {
    console.error(error);
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

export const listarMisInscripciones = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const inscripciones = await Inscripcion.findAll({
      where: { usuario_id },
      include: [{ model: Curso }],
      order: [['id', 'ASC']]
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar estado de inscripción (toggle entre 'comprado' y 'pendiente')
export const revertirEstadoInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await Inscripcion.findByPk(id);
    if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
    inscripcion.estado = inscripcion.estado === 'comprado' ? 'pendiente' : 'comprado';
    await inscripcion.save();
    res.json({ message: 'Estado de inscripción actualizado', estado: inscripcion.estado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 