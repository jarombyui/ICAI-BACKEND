import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Inscripcion from './inscripcion.js';

const Pago = sequelize.define('pago', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inscripcion_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'inscripcion', key: 'id' } },
  metodo: { type: DataTypes.STRING, allowNull: false },
  monto: { type: DataTypes.DECIMAL(6,2), allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { type: DataTypes.STRING, defaultValue: 'pendiente' }
}, {
  tableName: 'pago',
  timestamps: false
});

Pago.belongsTo(Inscripcion, { foreignKey: 'inscripcion_id' });

export default Pago; 