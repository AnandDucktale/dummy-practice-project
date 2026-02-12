import { useState } from 'react';
import api from '../../api/axios';

export default function useGroupMembers(groupId) {
  const [groupMembers, setGroupMembers] = useState([]);
  const [alreadyPresentUserIds, setAlreadyPresentUserIds] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchGroupMembers = async () => {
    try {
      const params = {
        groupId: groupId,
      };

      const response = await api.get('/group/groupMembers', { params: params });

      //   console.log(response);

      setGroupMembers(response.data?.groupMembers);

      response.data?.groupMembers.forEach((member) => {
        const memberId = member.userId._id;
        // console.log(memberId);

        setAlreadyPresentUserIds((prev) => [...prev, memberId]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/getAllusers');
      //   console.log(response);

      if (response.status === 200) {
        setAllUsers(response.data.users);
      }
      await fetchGroupMembers();
    } catch (error) {
      // console.log('Error while fetching all users', error);
    }
  };

  const onAddMembers = async (selectedUserIds) => {
    // console.log(selectedUserIds);
    try {
      const response = await api.post(
        '/group/addMemberToGroup',
        { groupId, selectedUserIds },
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      // console.log('Error while adding more users', error);
    } finally {
      await fetchGroupMembers();
      await fetchAllUsers();
    }
  };

  const onRemoveMembers = async (selectedUserIds) => {
    try {
      const response = await api.post(
        '/group/removeMemberFromGroup',
        { groupId, selectedUserIds },
        { headers: { 'Content-Type': 'application/json' } },
      );
      //   toast.success(
      //     response?.data.message || 'Members removed from group',
      //     toastParameters,
      //   );
    } catch (error) {
      // console.log('Error while removing users', error);
      //   toast.error(
      //     error?.response?.data.message || 'Internal Server Error',
      //     toastParameters,
      //   );
    } finally {
      // await fetchGroupData(groupId);
      await fetchGroupMembers();
      await fetchAllUsers();
    }
  };

  return {
    groupMembers,
    allUsers,
    alreadyPresentUserIds,
    fetchGroupMembers,
    fetchAllUsers,
    onRemoveMembers,
    onAddMembers,
  };
}
