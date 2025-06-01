import express from 'express';
import {
  listarModulosPorCurso,
  verModulo,
  crearModulo,
  actualizarModulo,
  eliminarModulo
} from '../controllers/moduloController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar módulos de un curso (público)
router.get('/curso/:curso_id', listarModulosPorCurso);

// Ver un módulo (público)
router.get('/:id', verModulo);

// Crear módulo (solo admin)
router.post('/', verificarToken, esAdmin, crearModulo);

// Actualizar módulo (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarModulo);

// Eliminar módulo (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarModulo);

export default router; 