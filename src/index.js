import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import routerUser from './routes/user.js';
import routerAuth from './routes/user.js';


const app = express();

dotenv.config();

// Configuración de Express
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Conexión a la base de datos de MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));


// rutas
app.use('/api/user', routerUser)
app.use('/api/auth', routerAuth)

// Puerto del servidor
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
