import express from 'express';
import { listarExamenesPorModulo, verExamen, responderExamen } from '../controllers/examenController.js';

const router = express.Router();

router.get('/modulos/:modulo_id/examenes', listarExamenesPorModulo);
router.get('/examenes/:examen_id', verExamen);
router.post('/examenes/:examen_id/responder', responderExamen);

export default router; 