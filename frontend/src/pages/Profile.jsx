import React from 'react';

import Avatar from '../components/Avatar';
import useAuthStore from '../hooks/store/useAuthStore';

const Profile = () => {
  const { user } = useAuthStore();
  return (
    <div className="h-full flex flex-col gap-4 bg-gray-100 p-8">
      {/* <h1 className="text-4xl text-fuchsia-950">Profile</h1> */}
      <div className="flex items-center gap-10">
        <Avatar />
        <p className=" text-6xl font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <div className="rounded-sm overflow-hidden">
        <p className="w-full py-8 p-4 flex gap-8 items-center border-l-4 border-l-fuchsia-800 bg-fuchsia-950/10 backdrop-blur-2xl">
          <span className="text-lg font-semibold">Email Address:</span>
          <span className="text-zinc-500 text-md">{user.email}</span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
