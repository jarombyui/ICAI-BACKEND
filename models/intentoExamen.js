import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const IntentoExamen = sequelize.define('intento_examen', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  examen_id: { type: DataTypes.INTEGER, allowNull: false },
  puntaje: { type: DataTypes.DECIMAL(5,2), allowNull: false },
  aprobado: { type: DataTypes.BOOLEAN, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'intento_examen',
  timestamps: false
});

export default IntentoExamen; 