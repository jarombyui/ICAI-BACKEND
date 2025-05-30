import { Examen, Pregunta, Respuesta } from '../models/index.js';
import { sequelize, IntentoExamen, Inscripcion, Curso, Modulo } from '../models/index.js';
import jwt from 'jsonwebtoken';

export const listarExamenesPorModulo = async (req, res) => {
  try {
    const { modulo_id } = req.params;
    const examenes = await Examen.findAll({
      where: { modulo_id },
      include: [{
        model: Pregunta,
        as: 'preguntas',
        include: [{ model: Respuesta, as: 'respuestas' }]
      }]
    });
    res.json(examenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verExamen = async (req, res) => {
  try {
    const { examen_id } = req.params;
    const examen = await Examen.findByPk(examen_id, {
      include: [{
        model: Pregunta,
        as: 'preguntas',
        include: [{ model: Respuesta, as: 'respuestas' }]
      }]
    });
    if (!examen) return res.status(404).json({ error: 'Examen no encontrado' });
    res.json(examen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const responderExamen = async (req, res) => {
  try {
    const { examen_id } = req.params;
    const { respuestas } = req.body; // [{ pregunta_id, respuesta_id }]
    // Obtener usuario_id del token JWT
    let usuario_id = 1; // valor por defecto
    const authHeader = req.headers.authorization;
    let payload = null;
    console.log('Authorization header:', authHeader);
    let token = null;
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        token = authHeader;
      }
      try {
        payload = jwt.decode(token);
        console.log('Decoded payload:', payload);
        if (payload && payload.id) usuario_id = payload.id;
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
    }
    console.log('usuario_id usado para intento:', usuario_id);
    let correctas = 0;
    for (const r of respuestas) {
      const respuesta = await Respuesta.findOne({ where: { id: r.respuesta_id, pregunta_id: r.pregunta_id } });
      if (respuesta && respuesta.es_correcta) correctas++;
    }
    const total = respuestas.length;
    const examen = await Examen.findByPk(examen_id);
    if (!examen) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }
    const porcentaje = (correctas / total) * 100;
    const aprobado = porcentaje >= (examen.porcentaje_aprob || 60);
    // Registrar el intento
    try {
      const intento = await IntentoExamen.create({
        usuario_id,
        examen_id,
        puntaje: porcentaje,
        aprobado
      });
      console.log('Intento guardado:', intento?.toJSON?.() || intento);
    } catch (err) {
      console.error('Error al guardar intento:', err);
    }
    // Si aprobó, actualizar fechas en la inscripción
    if (aprobado) {
      // Obtener el módulo y curso asociados al examen
      const modulo = await Modulo.findByPk(examen.modulo_id);
      const curso = await Curso.findByPk(modulo.curso_id);
      // Buscar la inscripción del usuario en el curso
      const inscripcion = await Inscripcion.findOne({ where: { usuario_id, curso_id: curso.id } });
      if (inscripcion) {
        let diasRestar = 0;
        if (curso.horas === 45) diasRestar = 10;
        else if (curso.horas === 90) diasRestar = 21;
        else if (curso.horas === 120) diasRestar = 45;
        const fechaFin = new Date();
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaFin.getDate() - diasRestar);
        await inscripcion.update({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin
        });
      }
    }
    res.json({ correctas, total, porcentaje, aprobado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listarIntentosExamen = async (req, res) => {
  try {
    const { examen_id } = req.params;
    const usuario_id = req.query.usuario_id || 1; // Simulación, ajusta según tu auth real
    const intentos = await IntentoExamen.findAll({
      where: { examen_id, usuario_id },
      order: [['fecha', 'DESC']]
    });
    res.json(intentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 