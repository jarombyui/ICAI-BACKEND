import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Categoria = sequelize.define('categoria', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'categoria',
  timestamps: false
});

export default Categoria; 