import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Categoria from './categoria.js';
import Curso from './curso.js';
import Modulo from './modulo.js';
import Subtema from './subtema.js';
import Material from './material.js';
import Inscripcion from './inscripcion.js';
import Pago from './pago.js';

// Asociaciones
Subtema.belongsTo(Modulo, { foreignKey: 'modulo_id' });
Modulo.hasMany(Subtema, { foreignKey: 'modulo_id' });
Subtema.hasMany(Material, { as: 'materiales', foreignKey: 'subtema_id' });
Material.belongsTo(Subtema, { foreignKey: 'subtema_id' });

export {
  sequelize,
  Usuario,
  Categoria,
  Curso,
  Modulo,
  Subtema,
  Material,
  Inscripcion,
  Pago,
}; 