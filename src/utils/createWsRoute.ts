import { WebSocketServer } from 'ws';
import { Server } from 'http';
import wsRoute from '../routes/ws/ws';

export default (server: Server) => {
  const wss = new WebSocketServer({ server, path: '/ws' });
  wss.on('connection', wsRoute);
};
