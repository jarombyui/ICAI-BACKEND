import express from 'express';
import { listarCursos, verCurso, crearCurso } from '../controllers/cursoController.js';

const router = express.Router();

router.get('/', listarCursos);
router.get('/:id', verCurso);
router.post('/', crearCurso);

export default router; 