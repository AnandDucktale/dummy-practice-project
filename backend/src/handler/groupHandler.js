import logger from '../logger.js';

const registerGroupHandler = (io, socket) => {
  socket.on('group:join', ({ groupId }) => {
    socket.join(groupId);
    logger.info(
      `User ${socket.user._id} with socket ID: ${socket.id} join room: ${groupId}`,
    );
  });

  socket.on('document:upload', ({ groupId, document }) => {
    io.to(groupId).emit('document:new', {
      userId: socket.user.id,
      document,
    });
  });

  socket.on('group:leave', ({ groupId }) => {
    socket.leave(groupId);
    logger.info(
      `User ${socket.user._id} with socket ID: ${socket.id} leave room: ${groupId}`,
    );
  });
};
export default registerGroupHandler;
