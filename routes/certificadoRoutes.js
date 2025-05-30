import express from 'express';
import { emitirCertificado } from '../controllers/certificadoController.js';

const router = express.Router();

router.post('/emitir', emitirCertificado);

export default router; 