import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, dni } = req.body;
    
    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    // Crear usuario con rol por defecto 'user'
    const usuario = await Usuario.create({ 
      nombre, 
      apellido, 
      email, 
      password: passwordEncriptado, 
      dni,
      rol: 'user' // Rol por defecto
    });

    // Generar token con el rol incluido
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        rol: usuario.rol 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token con el rol incluido
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        rol: usuario.rol 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Login exitoso', 
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 