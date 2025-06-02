import { sequelize } from '../config/database.js';
import Usuario from './usuario.js';
import Categoria from './categoria.js';
import { Curso } from './curso.js';
import Modulo from './modulo.js';
import Subtema from './subtema.js';
import Material from './material.js';
import Inscripcion from './inscripcion.js';
import Pago from './pago.js';
import Examen from './examen.js';
import Pregunta from './pregunta.js';
import Respuesta from './respuesta.js';
import IntentoExamen from './intentoExamen.js';
import Certificado from './certificado.js';

// Asociaciones
Subtema.belongsTo(Modulo, { foreignKey: 'modulo_id' });
Modulo.hasMany(Subtema, { foreignKey: 'modulo_id' });
Subtema.hasMany(Material, { as: 'materiales', foreignKey: 'subtema_id' });
Material.belongsTo(Subtema, { foreignKey: 'subtema_id' });

// Relación Curso <-> Inscripcion
Curso.hasMany(Inscripcion, { foreignKey: 'curso_id' });
Inscripcion.belongsTo(Curso, { foreignKey: 'curso_id' });

// Examenes y preguntas
Examen.belongsTo(Modulo, { foreignKey: 'modulo_id' });
Modulo.hasMany(Examen, { as: 'examenes', foreignKey: 'modulo_id' });
Examen.hasMany(Pregunta, { as: 'preguntas', foreignKey: 'examen_id' });
Pregunta.belongsTo(Examen, { foreignKey: 'examen_id' });
Pregunta.hasMany(Respuesta, { as: 'respuestas', foreignKey: 'pregunta_id' });
Respuesta.belongsTo(Pregunta, { foreignKey: 'pregunta_id' });

// Relación Certificado <-> Usuario y Curso
Certificado.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Certificado, { foreignKey: 'usuario_id' });
Certificado.belongsTo(Curso, { foreignKey: 'curso_id' });
Curso.hasMany(Certificado, { foreignKey: 'curso_id' });

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
  Examen,
  Pregunta,
  Respuesta,
  IntentoExamen,
  Certificado,
}; 