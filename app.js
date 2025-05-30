import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import examenRoutes from './routes/examenRoutes.js';
import certificadoRoutes from './routes/certificadoRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/examenes', examenRoutes);
app.use('/api/certificados', certificadoRoutes);

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error('Error de conexión:', err)); 