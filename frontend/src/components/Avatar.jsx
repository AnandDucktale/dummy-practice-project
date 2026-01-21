import React, { useState } from 'react';
import defaultAvatar from '../assets/defaultAvatar1.jpg';
import api from '../api/axios';
import useAuthStore from '../hooks/store/useAuthStore';
import { TiPencil } from 'react-icons/ti';

const Avatar = () => {
  const { user, updateUser } = useAuthStore();
  const [profilePic, setProfilePic] = useState(user.avatar || null);

  const handlePicSubmission = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append('avatar', file);

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);

      setProfilePic(response.data.avatar);

      updateUser({
        avatar: response.data.avatar,
      });
    } catch (error) {
      console.error('On avatar uploading', error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
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
        accept="image/*"
      />
    </div>
  );
};

export default Avatar;
