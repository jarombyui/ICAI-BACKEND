import express from 'express';
import {
  listarMaterialesPorSubtema,
  verMaterial,
  crearMaterial,
  actualizarMaterial,
  eliminarMaterial
} from '../controllers/materialController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar materiales de un subtema (público)
router.get('/subtema/:subtema_id', listarMaterialesPorSubtema);

// Ver un material (público)
router.get('/:id', verMaterial);

// Crear material (solo admin)
router.post('/', verificarToken, esAdmin, crearMaterial);

// Actualizar material (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarMaterial);

// Eliminar material (solo admin)
router.delete('/:id', verificarToken, esAdmin, eliminarMaterial);

export default router; 