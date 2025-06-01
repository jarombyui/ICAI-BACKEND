import express from 'express';
import { registrarPago, listarPagosPorInscripcion, listarPagosAdmin } from '../controllers/pagoController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', registrarPago);
router.get('/inscripcion/:inscripcion_id', listarPagosPorInscripcion);
router.get('/admin/listar', verificarToken, esAdmin, listarPagosAdmin);

export default router; 