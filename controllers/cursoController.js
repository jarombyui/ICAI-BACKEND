import { Curso, Categoria, Modulo, Subtema, Material, Inscripcion, Examen } from '../models/index.js';

export const listarCursos = async (req, res) => {
  try {
    const { categoria_id, estado } = req.query;
    const where = {};
    
    if (categoria_id) where.categoria_id = categoria_id;
    if (estado) where.estado = estado;

    const cursos = await Curso.findAll({
      where,
      include: [
        { model: Categoria, attributes: ['id', 'nombre'] },
        {
          model: Modulo,
          include: [
            {
              model: Subtema,
              include: [
                { model: Material, as: 'materiales', attributes: ['id', 'tipo', 'url', 'descripcion'] }
              ]
            },
            {
              model: Examen,
              as: 'examenes',
              attributes: ['id', 'nombre', 'porcentaje_aprob']
            }
          ],
          order: [['orden', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(cursos);
  } catch (error) {
    console.error('Error en listarCursos:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id, {
      include: [
        { 
          model: Categoria, 
          attributes: ['id', 'nombre'] 
        },
        {
          model: Modulo,
          as: 'modulos',
          include: [
            {
              model: Subtema,
              as: 'subtemas',
              include: [
                { 
                  model: Material, 
                  as: 'materiales',
                  attributes: ['id', 'tipo', 'url', 'descripcion']
                }
              ]
            },
            {
              model: Examen,
              as: 'examenes',
              attributes: ['id', 'nombre', 'porcentaje_aprob']
            }
          ],
          order: [['orden', 'ASC']]
        }
      ]
    });
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(curso);
  } catch (error) {
    console.error('Error en verCurso:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearCurso = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      categoria_id, 
      precio, 
      horas, 
      estado = 'activo', 
      imagen_url 
    } = req.body;

    // Validaciones
    if (!nombre || !descripcion || !categoria_id || !precio || !horas) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: nombre, descripcion, categoria_id, precio, horas' 
      });
    }

    // Verificar si la categoría existe
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      return res.status(400).json({ error: 'La categoría especificada no existe' });
    }

    // Validar valores numéricos
    if (precio < 0 || horas <= 0) {
      return res.status(400).json({ 
        error: 'El precio debe ser mayor o igual a 0 y las horas deben ser mayores a 0' 
      });
    }

    const curso = await Curso.create({ 
      nombre, 
      descripcion, 
      categoria_id, 
      precio, 
      horas, 
      estado, 
      imagen_url 
    });

    res.status(201).json(curso);
  } catch (error) {
    console.error('Error en crearCurso:', error);
    res.status(400).json({ error: error.message });
  }
};

export const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      categoria_id, 
      precio, 
      horas, 
      estado, 
      imagen_url 
    } = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Si se proporciona categoria_id, verificar que existe
    if (categoria_id) {
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría especificada no existe' });
      }
    }

    // Validar valores numéricos si se proporcionan
    if (precio !== undefined && precio < 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor o igual a 0' });
    }
    if (horas !== undefined && horas <= 0) {
      return res.status(400).json({ error: 'Las horas deben ser mayores a 0' });
    }

    // Actualizar curso
    await curso.update({
      nombre: nombre || curso.nombre,
      descripcion: descripcion || curso.descripcion,
      categoria_id: categoria_id || curso.categoria_id,
      precio: precio !== undefined ? precio : curso.precio,
      horas: horas !== undefined ? horas : curso.horas,
      estado: estado || curso.estado,
      imagen_url: imagen_url || curso.imagen_url
    });

    // Obtener el curso actualizado con sus relaciones
    const cursoActualizado = await Curso.findByPk(id, {
      include: [
        { 
          model: Categoria, 
          attributes: ['id', 'nombre'] 
        }
      ]
    });

    res.json(cursoActualizado);
  } catch (error) {
    console.error('Error en actualizarCurso:', error);
    res.status(400).json({ error: error.message });
  }
};

export const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Verificar si hay inscripciones activas
    const inscripcionesActivas = await curso.getInscripcions({
      where: { fecha_fin: null }
    });

    if (inscripcionesActivas.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el curso porque tiene inscripciones activas' 
      });
    }

    // Eliminar curso
    await curso.destroy();
    res.json({ message: 'Curso eliminado exitosamente' });
  } catch (error) {
    console.error('Error en eliminarCurso:', error);
    res.status(500).json({ error: error.message });
  }
}; 