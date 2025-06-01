import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

// Middleware para verificar el token JWT
export const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ mensaje: 'No se proporcionó token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

// Middleware para verificar rol de administrador
export const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requieren privilegios de administrador' });
  }
  next();
};

// Middleware para verificar si es el mismo usuario o admin
export const esMismoUsuarioOAdmin = (req, res, next) => {
  const { id } = req.params;
  
  if (req.usuario.rol === 'admin' || req.usuario.id === parseInt(id)) {
    next();
  } else {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
}; 