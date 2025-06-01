import express from 'express';
import { 
  emitirCertificado, 
  listarCertificados, 
  listarCertificadosUsuario,
  validarCertificado,
  descargarMiCertificado
} from '../controllers/certificadoController.js';
import { verificarToken, esAdmin, esMismoUsuarioOAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/validar/:id', validarCertificado);

// Rutas que requieren autenticación
router.post('/emitir', verificarToken, emitirCertificado);

// Rutas que requieren ser admin
router.get('/admin/listar', verificarToken, esAdmin, listarCertificados);

// Rutas que requieren ser el mismo usuario o admin
router.get('/usuario/:id', verificarToken, esMismoUsuarioOAdmin, listarCertificadosUsuario);

router.get('/descargar/:curso_id', verificarToken, descargarMiCertificado);

export default router; 