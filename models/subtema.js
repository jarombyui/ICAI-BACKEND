import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Modulo from './modulo.js';

const Subtema = sequelize.define('subtema', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modulo_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'modulo', key: 'id' } },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  orden: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'subtema',
  timestamps: false
});

Subtema.belongsTo(Modulo, { foreignKey: 'modulo_id' });
Modulo.hasMany(Subtema, { foreignKey: 'modulo_id' });

export default Subtema; 