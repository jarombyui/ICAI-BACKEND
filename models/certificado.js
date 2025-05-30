import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Certificado = sequelize.define('certificado', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  curso_id: { type: DataTypes.INTEGER, allowNull: false },
  url_pdf: { type: DataTypes.STRING, allowNull: false },
  fecha_emision: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  horas: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'certificado',
  timestamps: false
});

export default Certificado; 