import express from 'express';
import { inscribir, listarInscripcionesUsuario, eliminarInscripcion, listarTodasInscripciones, listarMisInscripciones, revertirEstadoInscripcion } from '../controllers/inscripcionController.js';
import { verificarToken, esAdmin, esMismoUsuarioOAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas que requieren autenticación
router.post('/', verificarToken, inscribir);
router.get('/mis', verificarToken, listarMisInscripciones);

// Rutas que requieren ser el mismo usuario o admin
router.get('/usuario/:usuario_id', verificarToken, esMismoUsuarioOAdmin, listarInscripcionesUsuario);
router.delete('/:id', verificarToken, esMismoUsuarioOAdmin, eliminarInscripcion);

// Rutas que requieren ser admin
router.get('/admin/listar', verificarToken, esAdmin, listarTodasInscripciones);
router.patch('/admin/revertir/:id', verificarToken, esAdmin, revertirEstadoInscripcion);

router.get('/admin/estadisticas', verificarToken, esAdmin, (req, res) => {
  // TODO: Implementar estadísticas de inscripciones para admin
  res.json({ message: 'Estadísticas de inscripciones (solo admin)' });
});

export default router; 