import express from 'express';
import { 
  listarCursos, 
  verCurso, 
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  uploadCursoImage,
  subirImagenCurso
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

// Subida de imagen de curso (solo admin)
router.post('/upload', verificarToken, esAdmin, uploadCursoImage.single('file'), subirImagenCurso);

export default router; 