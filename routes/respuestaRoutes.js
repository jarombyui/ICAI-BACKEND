import express from 'express';
import { crearRespuesta, listarRespuestas, actualizarRespuesta, eliminarRespuesta } from '../controllers/respuestaController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear respuesta (solo admin)
router.post('/', verificarToken, esAdmin, crearRespuesta);

// Listar respuestas de una pregunta (admin)
router.get('/', verificarToken, esAdmin, listarRespuestas);

// Actualizar respuesta (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarRespuesta);

// Eliminar respuesta (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarRespuesta);

export default router; 