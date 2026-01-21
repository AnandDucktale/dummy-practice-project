import useAuthStore from '../hooks/store/useAuthStore.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const SideBar = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const baseClass =
    'tracking-widest text-xs uppercase text-center p-4 transition-all';

  const activeClass = 'bg-fuchsia-950/80 backdrop-blur-2xl text-fuchsia-100';

  const inactiveClass =
    'text-fuchsia-950 hover:bg-fuchsia-950/60 hover:backdrop-blur-2xl hover:text-fuchsia-100';

  // console.log(user);

  const logout = async () => {
    try {
      const response = await api.post('/user/logout', {});
      // console.log(response);
      clearAuth();
      console.log(response);

      localStorage.setItem('refreshToken', response.data.refreshToken);

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className=" h-full flex flex-col w-full bg-gray-200 ">
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Contacts
          </NavLink>

          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Groups
          </NavLink>

          {user.role === 'admin' && (
            <NavLink
              to="/show-users-to-admin"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : inactiveClass}`
              }
            >
              Users
            </NavLink>
          )}
        </div>

        <div className="w-full flex flex-col">
          <button
            onClick={() => logout()}
            className="w-full text-xs tracking-widest uppercase text-center p-4 text-fuchsia-950 hover:text-fuchsia-50 bg-fuchsia-950/10 backdrop-blur-2xl hover:bg-fuchsia-950/80 hover:backdrop-blur-2xl   transition-all font-semibold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
