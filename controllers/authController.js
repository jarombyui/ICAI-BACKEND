import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    // Guardar en texto plano (solo para pruebas, NO recomendado en producción)
    const usuario = await Usuario.create({ nombre, apellido, email, password });
    res.status(201).json({ message: 'Usuario registrado', usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login exitoso', token, usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 