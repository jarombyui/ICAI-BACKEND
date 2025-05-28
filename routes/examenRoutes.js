import express from 'express';
import { listarExamenesPorModulo, verExamen, responderExamen, listarIntentosExamen } from '../controllers/examenController.js';

const router = express.Router();

router.get('/modulos/:modulo_id/examenes', listarExamenesPorModulo);
router.get('/examenes/:examen_id', verExamen);
router.post('/examenes/:examen_id/responder', responderExamen);
router.get('/examenes/:examen_id/intentos', listarIntentosExamen);

export default router; 