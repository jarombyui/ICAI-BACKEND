import express from 'express';
import { listarExamenesPorModulo, verExamen, responderExamen, listarIntentosExamen, crearExamen, actualizarExamen, eliminarExamen, listarMisIntentosExamen } from '../controllers/examenController.js';
import { verificarToken, esAdmin, esMismoUsuarioOAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas que requieren autenticación
router.get('/modulos/:modulo_id/examenes', verificarToken, listarExamenesPorModulo);
router.get('/examenes/:examen_id', verificarToken, verExamen);
router.post('/examenes/:examen_id/responder', verificarToken, responderExamen);

// Rutas que requieren ser el mismo usuario o admin
router.get('/examenes/:examen_id/intentos', verificarToken, esMismoUsuarioOAdmin, listarIntentosExamen);
router.get('/examenes/:examen_id/mis-intentos', verificarToken, listarMisIntentosExamen);

// Rutas que requieren ser admin
router.post('/examenes', verificarToken, esAdmin, crearExamen);
router.put('/examenes/:examen_id', verificarToken, esAdmin, actualizarExamen);
router.delete('/examenes/:examen_id', verificarToken, esAdmin, eliminarExamen);

export default router; 