import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Curso from './curso.js';

const Modulo = sequelize.define('modulo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  curso_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'curso', key: 'id' } },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  orden: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'modulo',
  timestamps: true
});

Modulo.belongsTo(Curso, { foreignKey: 'curso_id' });
Curso.hasMany(Modulo, { foreignKey: 'curso_id' });

export default Modulo; 