import { NavLink } from 'react-router-dom';

import useAuthStore from '../hooks/store/useAuthStore';
import defaultPic from '../assets/defaultAvatar1.jpg';

const Header = () => {
  const { user } = useAuthStore();
  const profilePic = user.avatar || defaultPic;
  return (
    <nav className="p-4 px-12 flex justify-between items-center w-full max-w-full">
      <div className="flex gap-2 items-center ">
        <div className="text-fuchsia-50 h-10 w-10 font-bold rounded-[100%] bg-fuchsia-950 flex items-center justify-center">
          {user.firstName[0]}
        </div>
        <div className="text-2xl font-bold">Logo Name</div>
      </div>

      <div className="w-12 h-12 rounded-full overflow-hidden hover:shadow-2xl hover:shadow-fuchsia-950 focus:shadow-fuchsia-950 active:shadow-fuchsia-950 cursor-pointer transition-all">
        <NavLink to="/profile">
          <img
            src={profilePic}
            alt="Pic"
            className="w-full h-full object-cover"
          />
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
