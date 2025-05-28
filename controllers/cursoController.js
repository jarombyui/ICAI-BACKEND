import { Curso, Categoria, Modulo, Subtema, Material } from '../models/index.js';

export const listarCursos = async (req, res) => {
  try {
    const { categoria_id } = req.query;
    const where = categoria_id ? { categoria_id } : {};
    const cursos = await Curso.findAll({
      where,
      include: [{ model: Categoria, attributes: ['nombre'] }],
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id, {
      include: [
        { model: Categoria, attributes: ['nombre'] },
        {
          model: Modulo,
          include: [
            {
              model: Subtema,
              include: [
                { model: Material, as: 'materiales' }
              ]
            }
          ]
        }
      ]
    });
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCurso = async (req, res) => {
  try {
    const { nombre, descripcion, categoria_id, precio, horas, estado, imagen_url } = req.body;
    const curso = await Curso.create({ nombre, descripcion, categoria_id, precio, horas, estado, imagen_url });
    res.status(201).json(curso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 