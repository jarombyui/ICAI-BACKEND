import { Examen, Pregunta, Respuesta } from '../models/index.js';

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
    let correctas = 0;
    for (const r of respuestas) {
      const respuesta = await Respuesta.findOne({ where: { id: r.respuesta_id, pregunta_id: r.pregunta_id } });
      if (respuesta && respuesta.es_correcta) correctas++;
    }
    const total = respuestas.length;
    const examen = await Examen.findByPk(examen_id);
    const porcentaje = (correctas / total) * 100;
    const aprobado = porcentaje >= (examen.porcentaje_aprob || 60);
    res.json({ correctas, total, porcentaje, aprobado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 