import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Subtema from './subtema.js';

const Material = sequelize.define('material', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  subtema_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'subtema', key: 'id' } },
  tipo: { type: DataTypes.STRING, allowNull: false }, // pdf, ppt, video
  url: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.STRING }
}, {
  tableName: 'material',
  timestamps: true
});

Material.belongsTo(Subtema, { foreignKey: 'subtema_id' });

export default Material; 