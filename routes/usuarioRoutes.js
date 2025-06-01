import express from 'express';
import { listarUsuarios, actualizarRolUsuario, verUsuario } from '../controllers/usuarioController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todos los usuarios (solo admin)
router.get('/', verificarToken, esAdmin, listarUsuarios);

// Ver un usuario específico (solo admin)
router.get('/:id', verificarToken, esAdmin, verUsuario);

// Actualizar el rol de un usuario (solo admin)
router.put('/:id', verificarToken, esAdmin, actualizarRolUsuario);

export default router; 