import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  listarMaterialesPorSubtema,
  verMaterial,
  crearMaterial,
  actualizarMaterial,
  eliminarMaterial
} from '../controllers/materialController.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads/materiales'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Endpoint para subir archivos
router.post('/upload', verificarToken, esAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
  const url = `/uploads/materiales/${req.file.filename}`;
  res.json({ url });
});

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