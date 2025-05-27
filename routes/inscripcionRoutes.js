import express from 'express';
import { inscribir, listarInscripcionesUsuario, eliminarInscripcion } from '../controllers/inscripcionController.js';

const router = express.Router();

router.post('/', inscribir);
router.get('/usuario/:usuario_id', listarInscripcionesUsuario);
router.delete('/:id', eliminarInscripcion);

export default router; 