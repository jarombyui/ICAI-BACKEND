import { Modulo, Curso } from '../models/index.js';

// Listar todos los módulos
export const listarModulos = async (req, res) => {
  try {
    const modulos = await Modulo.findAll({
      include: [{ model: Curso, attributes: ['id', 'nombre'] }],
      order: [['orden', 'ASC']]
    });
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar módulos por curso
export const listarModulosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const modulos = await Modulo.findAll({
      where: { curso_id: cursoId },
      include: [{ model: Curso, attributes: ['id', 'nombre'] }],
      order: [['orden', 'ASC']]
    });
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear módulo
export const crearModulo = async (req, res) => {
  try {
    const { nombre, descripcion, orden, curso_id } = req.body;
    
    // Verificar si el curso existe
    const curso = await Curso.findByPk(curso_id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const modulo = await Modulo.create({
      nombre,
      descripcion,
      orden,
      curso_id
    });

    res.status(201).json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar módulo
export const actualizarModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden, curso_id } = req.body;

    const modulo = await Modulo.findByPk(id);
    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // Si se cambia el curso, verificar que exista
    if (curso_id && curso_id !== modulo.curso_id) {
      const curso = await Curso.findByPk(curso_id);
      if (!curso) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }
    }

    await modulo.update({
      nombre,
      descripcion,
      orden,
      curso_id
    });

    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar módulo
export const eliminarModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await Modulo.findByPk(id);
    
    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    await modulo.destroy();
    res.json({ message: 'Módulo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener módulo por ID
export const obtenerModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const modulo = await Modulo.findByPk(id, {
      include: [{ model: Curso, attributes: ['id', 'nombre'] }]
    });

    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    res.json(modulo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 