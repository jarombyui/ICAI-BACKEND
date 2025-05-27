import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Categoria from './categoria.js';
import Curso from './curso.js';
import Inscripcion from './inscripcion.js';
import Pago from './pago.js';

export {
  sequelize,
  Usuario,
  Categoria,
  Curso,
  Inscripcion,
  Pago,
}; 