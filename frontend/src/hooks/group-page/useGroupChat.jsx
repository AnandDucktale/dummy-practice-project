import { useRef, useState } from 'react';
import api from '../../api/axios';

export default function useGroupChat(groupId) {
  const chatRef = useRef(null);
  const isAddingPreviousMessage = useRef(false);
  const isFetchingMore = useRef(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadNewMessages, setLoadNewMessages] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [messages, setMessages] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const newDocumentHandler = async (newMessage) => {
    setMessages((prev) => [...prev, ...newMessage]);
  };

  const fetchMessages = async () => {
    if (!groupId) return;

    setError('');
    setInitialLoading(true);

    try {
      const res = await api.get('/group/groupMessages', {
        params: {
          groupId,
          page: 1,
          limit: 10,
        },
      });

      setMessages(res.data.groupMessages);
      setHasMore(res.data.groupMessages.length === 10);
      setPage(2);
      setInitialLoading(false);
    } catch (error) {
      console.log('Error while fetching group messages', error);
      setError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    }
  };

  const loadMoreMessages = async () => {
    if (isFetchingMore.current || !hasMore) return;

    isFetchingMore.current = true;
    setLoadNewMessages(true);

    try {
      const res = await api.get('/group/groupMessages', {
        params: { groupId, page, limit: 10 },
      });

      const newMessages = res.data.groupMessages;

      if (!newMessages.length) {
        setHasMore(false);
      } else {
        isAddingPreviousMessage.current = true;

        setMessages((prev) => [...newMessages, ...prev]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      setError(e?.message || 'Internal server error');
    } finally {
      isFetchingMore.current = false;
      setLoadNewMessages(false);
    }
  };

  const sendTextMessage = async (textMessage) => {
    setError('');
    try {
      if (textMessage.trim() === '') return;
      const response = await api.post('/group/newGroupMessage', {
        groupId: groupId,
        data: textMessage,
      });
    } catch (error) {
      // console.error('Error while sending text message', error);
      setError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    }
  };

  const fetchGroupDetail = async () => {
    if (!groupId) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.get('/group/groupDetail', {
        params: { groupId },
      });

      setGroupName(res.data?.groupDetail.name);
      setGroupIcon(res.data?.groupDetail.icon);
    } catch (error) {
      console.log('Error while fetching group detail', error);
      setError(
        error?.message ||
          error?.response?.data.message ||
          'Internal server error',
      );
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (userId) => {
    setError('');
    try {
      const response = await api.post(
        '/group/leaveGroup',
        { userId, groupId },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      navigate('/groups');
    } catch (error) {
      if (error?.response?.status === 404 || error?.response?.status === 400) {
        // console.log(error?.response?.data.message || error?.message);
        setError(
          error?.message ||
            error?.response?.data.message ||
            'Internal server error',
        );
      }
    }
  };

  const generateInviteLink = async () => {
    try {
      const response = await api.post(
        '/group/generateInviteToken',
        { groupId: groupId },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      setInviteLink(response.data?.inviteLink);
    } catch (error) {
      // console.log('Error while generating invite link', error);
    }
  };

  return {
    chatRef,
    initialLoading,
    loadNewMessages,
    error,
    hasMore,
    isAddingPreviousMessage,
    messages,
    groupName,
    groupIcon,
    inviteLink,
    fetchMessages,
    sendTextMessage,
    fetchGroupDetail,
    generateInviteLink,
    leaveGroup,
    newDocumentHandler,
    loadMoreMessages,
  };
}
