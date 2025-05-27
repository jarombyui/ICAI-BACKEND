import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuario from './usuario.js';
import Curso from './curso.js';

const Inscripcion = sequelize.define('inscripcion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'usuario', key: 'id' } },
  curso_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'curso', key: 'id' } },
  estado: { type: DataTypes.STRING, defaultValue: 'pendiente' },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'inscripcion',
  timestamps: false
});

Inscripcion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Inscripcion.belongsTo(Curso, { foreignKey: 'curso_id' });

export default Inscripcion; 