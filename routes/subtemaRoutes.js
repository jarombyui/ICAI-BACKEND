import express from 'express';
import {
  listarSubtemasPorModulo,
  verSubtema,
  crearSubtema,
  actualizarSubtema,
  eliminarSubtema
} from '../controllers/subtemaController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar subtemas de un módulo (público)
router.get('/modulo/:modulo_id', listarSubtemasPorModulo);

// Ver un subtema (público)
router.get('/:id', verSubtema);

// Crear subtema (solo admin)
router.post('/', verificarToken, esAdmin, crearSubtema);

// Actualizar subtema (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarSubtema);

// Eliminar subtema (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarSubtema);

export default router; 