import React, { useState } from 'react';
import { TiPencil } from 'react-icons/ti';
import { toast, ToastContainer } from 'react-toastify';

import defaultAvatar from '../assets/defaultAvatar1.jpg';
import api from '../api/axios';
import useAuthStore from '../hooks/store/useAuthStore';

const Avatar = () => {
  const { user, updateUser } = useAuthStore();
  const [profilePic, setProfilePic] = useState(user.avatar || null);

  const handlePicSubmission = async (event) => {
    const file = event.target.files[0];

    if (!file) return;
    console.log(file);

    if (file.size > 1048576 * 2) {
      toast.warn('Avatar size should be less than 2MB');
      return;
    }

    const formData = new FormData();

    formData.append('avatar', file);

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfilePic(response.data.avatar);

      updateUser({
        avatar: response.data.avatar,
      });
      toast.success(response?.data.message || 'Avatar uploaded', {
        position: 'top-center',
        theme: 'colored',
        autoClose: 3000,
      });
    } catch (error) {
      // console.error('On avatar uploading', error);
      toast.error(
        error?.response?.data.message ||
          error?.message ||
          'Internal Server Error',
        {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        },
      );
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      <label
        htmlFor="avatarFile"
        className="group relative w-60 h-60 rounded-full overflow-hidden cursor-pointer hover:shadow-neutral-600 shadow-2xl transition-shadow"
      >
        <img
          src={profilePic || defaultAvatar}
          alt="Avatar"
          className="w-full h-full object-cover"
        />

        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity "
          title="Update profile pic"
        >
          <span className="text-fuchsia-100 text-2xl">
            <TiPencil title="Update profile pic" />
          </span>
        </div>
      </label>

      <input
        type="file"
        name="avatarFile"
        id="avatarFile"
        className="hidden"
        onChange={handlePicSubmission}
        accept="image/*, image/heic, image/heif, image/heic-sequence, image/heif-sequence, .heic, .heif, .heifs, .heics, .hif"
      />
    </div>
  );
};

export default Avatar;
