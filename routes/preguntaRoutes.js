import express from 'express';
import { crearPregunta, listarPreguntas, actualizarPregunta, eliminarPregunta } from '../controllers/preguntaController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear pregunta (solo admin)
router.post('/', verificarToken, esAdmin, crearPregunta);

// Listar preguntas de un examen (admin)
router.get('/', verificarToken, esAdmin, listarPreguntas);

// Actualizar pregunta (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarPregunta);

// Eliminar pregunta (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarPregunta);

export default router; 