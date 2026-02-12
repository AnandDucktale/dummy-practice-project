import { toast } from 'react-toastify';
import { getSocket } from '../../api/socket.js';
import GroupMessageNotification from '../../components/custom-toast/GroupMessageNotification.jsx';

export const joinGroupRoom = (groupId) => {
  getSocket().emit('group:join', { groupId });
};

export const leaveGroupRoom = (groupId) => {
  getSocket().emit('group:leave', { groupId });
};

export const newDocNotificationHandler = ({ senderInfo, group }) => {
  toast(<GroupMessageNotification senderInfo={senderInfo} group={group} />, {
    position: 'top-center',
    progress: undefined,
    hideProgressBar: false,
    autoClose: 3000,
    closeButton: true,
    style: {
      padding: '0px',
      width: 'fit-content',
    },
  });
};
