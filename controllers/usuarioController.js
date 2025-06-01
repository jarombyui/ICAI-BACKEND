import { Usuario } from '../models/index.js';

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']]
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar el rol de un usuario
export const actualizarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;
    if (!['admin', 'user'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    usuario.rol = rol;
    await usuario.save();
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ver un usuario específico
export const verUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 