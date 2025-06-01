import { Modulo } from '../models/index.js';
import { Curso } from '../models/index.js';

// Listar módulos de un curso
export const listarModulosPorCurso = async (req, res) => {
  try {
    const { curso_id } = req.params;
    const modulos = await Modulo.findAll({
      where: { curso_id },
      order: [['orden', 'ASC']]
    });
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver un módulo
export const verModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await Modulo.findByPk(id);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });
    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear módulo
export const crearModulo = async (req, res) => {
  try {
    const { curso_id, nombre, descripcion, orden } = req.body;
    if (!curso_id || !nombre || orden === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: curso_id, nombre, orden' });
    }
    // Verificar que el curso existe
    const curso = await Curso.findByPk(curso_id);
    if (!curso) {
      return res.status(400).json({ error: 'El curso especificado no existe' });
    }
    const modulo = await Modulo.create({ curso_id, nombre, descripcion, orden });
    res.status(201).json(modulo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar módulo
export const actualizarModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden } = req.body;
    const modulo = await Modulo.findByPk(id);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });
    await modulo.update({
      nombre: nombre || modulo.nombre,
      descripcion: descripcion || modulo.descripcion,
      orden: orden !== undefined ? orden : modulo.orden
    });
    res.json(modulo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar módulo
export const eliminarModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await Modulo.findByPk(id);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });
    await modulo.destroy();
    res.json({ message: 'Módulo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 