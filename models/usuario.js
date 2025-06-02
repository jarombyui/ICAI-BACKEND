import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Usuario = sequelize.define('usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, allowNull: true },
  google_id: { type: DataTypes.STRING, unique: true },
  rol: { 
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false
  },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'usuario',
  timestamps: false
});

export default Usuario; 