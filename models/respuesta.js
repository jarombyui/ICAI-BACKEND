import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Respuesta = sequelize.define('respuesta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pregunta_id: { type: DataTypes.INTEGER, allowNull: false },
  texto: { type: DataTypes.TEXT, allowNull: false },
  es_correcta: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
  tableName: 'respuesta',
  timestamps: false
});

export default Respuesta; 