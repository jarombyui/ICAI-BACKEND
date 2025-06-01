import { Subtema, Modulo } from '../models/index.js';

// Listar subtemas de un módulo
export const listarSubtemasPorModulo = async (req, res) => {
  try {
    const { modulo_id } = req.params;
    const subtemas = await Subtema.findAll({
      where: { modulo_id },
      order: [['orden', 'ASC']]
    });
    res.json(subtemas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver un subtema
export const verSubtema = async (req, res) => {
  try {
    const { id } = req.params;
    const subtema = await Subtema.findByPk(id);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });
    res.json(subtema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear subtema
export const crearSubtema = async (req, res) => {
  try {
    const { modulo_id, nombre, descripcion, orden } = req.body;
    if (!modulo_id || !nombre || orden === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: modulo_id, nombre, orden' });
    }
    // Verificar que el módulo existe
    const modulo = await Modulo.findByPk(modulo_id);
    if (!modulo) {
      return res.status(400).json({ error: 'El módulo especificado no existe' });
    }
    const subtema = await Subtema.create({ modulo_id, nombre, descripcion, orden });
    res.status(201).json(subtema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar subtema
export const actualizarSubtema = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden } = req.body;
    const subtema = await Subtema.findByPk(id);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });
    await subtema.update({
      nombre: nombre || subtema.nombre,
      descripcion: descripcion || subtema.descripcion,
      orden: orden !== undefined ? orden : subtema.orden
    });
    res.json(subtema);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar subtema
export const eliminarSubtema = async (req, res) => {
  try {
    const { id } = req.params;
    const subtema = await Subtema.findByPk(id);
    if (!subtema) return res.status(404).json({ error: 'Subtema no encontrado' });
    await subtema.destroy();
    res.json({ message: 'Subtema eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 