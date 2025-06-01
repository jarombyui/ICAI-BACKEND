import express from 'express';
import { 
  listarCursos, 
  verCurso, 
  crearCurso,
  actualizarCurso,
  eliminarCurso
} from '../controllers/cursoController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/', listarCursos);
router.get('/:id', verCurso);

// Rutas que requieren ser admin
router.post('/', verificarToken, esAdmin, crearCurso);
router.put('/:id', verificarToken, esAdmin, actualizarCurso);
router.delete('/:id', verificarToken, esAdmin, eliminarCurso);

export default router; 