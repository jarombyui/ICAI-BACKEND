import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pregunta = sequelize.define('pregunta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  examen_id: { type: DataTypes.INTEGER, allowNull: false },
  texto: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: 'pregunta',
  timestamps: false
});

export default Pregunta; 