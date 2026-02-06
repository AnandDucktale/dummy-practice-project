import api from '../api/axios';

export const uploadDocument = async ({ files, groupId }) => {
  if (!files.length) {
    throw new Error('No files provided');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('documents', file);
  });

  formData.append('groupId', groupId);

  const response = await api.post('/group/sendDocument', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};
