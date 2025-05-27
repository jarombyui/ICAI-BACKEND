import express from 'express';
import { registrarPago, listarPagosPorInscripcion } from '../controllers/pagoController.js';

const router = express.Router();


router.post('/', registrarPago);
router.get('/inscripcion/:inscripcion_id', listarPagosPorInscripcion);

export default router; 