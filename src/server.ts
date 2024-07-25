import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocketHandler } from './handler/socket.handler';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: '*'
  },
  pingInterval: 1000,
  pingTimeout: 2000
});

const websocketHandler = new WebSocketHandler(io);

server.listen(PORT, () => {
  console.log(`Servidor WebSocket escuchando en el puerto ${PORT}`);
});