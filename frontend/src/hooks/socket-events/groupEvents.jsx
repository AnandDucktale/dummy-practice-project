import { getSocket } from '../../api/socket.js';

export const joinGroupRoom = (groupId) => {
  getSocket().emit('group:join', { groupId });
};

export const leaveGroupRoom = (groupId) => {
  getSocket().emit('group:leave', { groupId });
};
