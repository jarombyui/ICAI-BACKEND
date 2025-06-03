import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Curso } from './curso.js';

export const Modulo = sequelize.define('Modulo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  curso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cursos',
      key: 'id'
    }
  }
}, {
  tableName: 'modulo',
  timestamps: true
});

// Relaciones
Modulo.belongsTo(Curso, { foreignKey: 'curso_id' });
Curso.hasMany(Modulo, { as: 'modulos', foreignKey: 'curso_id' });

export default Modulo; 