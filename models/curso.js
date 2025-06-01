import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Categoria from './categoria.js';

const Curso = sequelize.define('curso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  categoria_id: { type: DataTypes.INTEGER, references: { model: 'categoria', key: 'id' } },
  precio: { type: DataTypes.DECIMAL(6,2), allowNull: false },
  horas: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.STRING, defaultValue: 'activo' },
  imagen_url: { type: DataTypes.STRING }
}, {
  tableName: 'curso',
  timestamps: true
});

Curso.belongsTo(Categoria, { foreignKey: 'categoria_id' });

export default Curso; 