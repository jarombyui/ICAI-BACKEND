import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Examen = sequelize.define('examen', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modulo_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },
  porcentaje_aprob: { type: DataTypes.INTEGER, defaultValue: 60 }
}, {
  tableName: 'examen',
  timestamps: false
});

export default Examen; 