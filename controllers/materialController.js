import { Material, Subtema } from '../models/index.js';

// Listar materiales de un subtema
export const listarMaterialesPorSubtema = async (req, res) => {
  try {
    const { subtema_id } = req.params;
    const materiales = await Material.findAll({
      where: { subtema_id },
      order: [['id', 'ASC']]
    });
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver un material
export const verMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ error: 'Material no encontrado' });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear material
export const crearMaterial = async (req, res) => {
  try {
    const { subtema_id, tipo, url, descripcion } = req.body;
    if (!subtema_id || !tipo || !url) {
      return res.status(400).json({ error: 'Faltan campos requeridos: subtema_id, tipo, url' });
    }
    // Verificar que el subtema existe
    const subtema = await Subtema.findByPk(subtema_id);
    if (!subtema) {
      return res.status(400).json({ error: 'El subtema especificado no existe' });
    }
    const material = await Material.create({ subtema_id, tipo, url, descripcion });
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar material
export const actualizarMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, url, descripcion } = req.body;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ error: 'Material no encontrado' });
    await material.update({
      tipo: tipo || material.tipo,
      url: url || material.url,
      descripcion: descripcion || material.descripcion
    });
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar material
export const eliminarMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await Material.findByPk(id);
    if (!material) return res.status(404).json({ error: 'Material no encontrado' });
    await material.destroy();
    res.json({ message: 'Material eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 