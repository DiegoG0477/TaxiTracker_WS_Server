import express from 'express';
import dotenv from 'dotenv';
import * as http from 'http';
import { Server } from 'socket.io';
import { WebSocketHandler } from './handler/socket.handler';
import { socketioAuthMiddleware } from './middlewares/auth.middleware';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const app = express();

// Configuración de CORS con headers personalizados
app.use(cors({
  origin: '*', // En producción, especifica los orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Origin', 
    'Access-Control-Allow-Headers',
    'token',
    'kit_id'
  ],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // En producción, especifica los orígenes permitidos
    methods: ["GET", "POST"],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Access-Control-Allow-Origin', 
      'Access-Control-Allow-Headers',
      'token',
      'kit_id'
    ],
    credentials: true
  },
  pingInterval: 1000,
  pingTimeout: 2000
});

io.use(socketioAuthMiddleware);

const websocketHandler = new WebSocketHandler(io);

server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});