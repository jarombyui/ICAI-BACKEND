import express from 'express';
import {
  listarModulos,
  listarModulosPorCurso,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  obtenerModulo
} from '../controllers/moduloController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', listarModulos);
router.get('/curso/:cursoId', listarModulosPorCurso);
router.get('/:id', obtenerModulo);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, esAdmin, crearModulo);
router.put('/:id', verificarToken, esAdmin, actualizarModulo);
router.delete('/:id', verificarToken, esAdmin, eliminarModulo);

export default router; 