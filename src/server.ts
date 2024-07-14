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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'x-access-token', 'Origin', 'X-Requested-With', 'Accept', 'access_token' ],
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
      origin: '*'
  },
  pingInterval: 1000,
  pingTimeout: 2000
});

io.use(socketioAuthMiddleware);

const websocketHandler = new WebSocketHandler(io);

server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});
