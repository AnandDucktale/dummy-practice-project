import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useAuthStore from '../hooks/store/useAuthStore';

const Home = () => {
  const { user } = useAuthStore();

  const sayHello = () => toast.success(`Hello ${user.firstName}!`);

  return (
    <div className="h-full flex flex-col bg-gray-100 p-4 gap-2">
      <h1 className="text-4xl text-fuchsia-950">Hey, {user.firstName}!</h1>
      <div>
        <button
          onClick={sayHello}
          className="p-2 px-4 bg-fuchsia-950/80 backdrop-blur-3xl text-fuchsia-50 rounded-lg cursor-pointer"
        >
          Say Hello
        </button>
        <ToastContainer
          position="top-center"
          theme="colored"
          // style={{ width: '20px' }}
        />
      </div>
    </div>
  );
};

export default Home;
