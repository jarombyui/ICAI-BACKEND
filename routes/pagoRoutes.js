import express from 'express';
import { registrarPago, listarPagosPorInscripcion, listarPagosAdmin, aprobarPago, uploadComprobante, subirComprobantePago } from '../controllers/pagoController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', registrarPago);
router.get('/inscripcion/:inscripcion_id', listarPagosPorInscripcion);
router.get('/admin/listar', verificarToken, esAdmin, listarPagosAdmin);
router.put('/:id/estado', verificarToken, esAdmin, aprobarPago);
router.post('/comprobante', verificarToken, uploadComprobante.single('file'), subirComprobantePago);

export default router; 