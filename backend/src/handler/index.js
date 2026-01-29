import logger from '../logger.js';
import { verifyToken } from '../utils/verifyToken.js';
import registerGroupHandler from './groupHandler.js';

export const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        // logger.info('Unauthorized');
        return next(new Error('Unauthorized'));
      }

      const user = await verifyToken(token);
      socket.user = user;

      next();
    } catch (err) {
      logger.error(err, 'Invalid token');
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(
      `User ${socket.user.id} connected with socket ID: ${socket.id}`,
    );

    // User joined its own personal room because all its sockets that maybe open in another tab or in another browser or in another machine all are in one room
    socket.join(`user:${socket.user.id}`);

    registerGroupHandler(io, socket);

    socket.on('disconnect', () => {
      logger.info(
        `User ${socket.user.id} disconnected with socket ID: ${socket.id}`,
      );
    });
  });
};
