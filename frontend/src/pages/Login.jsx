import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../api/axios';
import useAuthStore from '../hooks/store/useAuthStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleAuthButton from '../components/GoogleAuthButton';

const userLoginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      console.log('login start');

      const response = await api.post('/user/login', values, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);

      toast.success('Login Successfully', {
        position: 'top-center',
        theme: 'colored',
      });

      // Zustand auth store
      setAuth(response.data.user, response.data.accessToken);

      // Store refresh token
      localStorage.setItem('refreshToken', response.data.refreshToken);

      if (localStorage.getItem('inviteToken')) {
        setTimeout(() => {
          navigate('/groups', { replace: true });
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      }
    } catch (error) {
      const message =
        error?.message ||
        error?.response?.data?.message ||
        'Login failed. Please try again.';

      // setError('root', { message });

      toast.error(message, {
        position: 'top-center',
        theme: 'colored',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        <ToastContainer
          position="top-center"
          theme="colored"
          autoClose={3000}
        />

        {/*Root error */}
        {errors.root && (
          <p className="text-red-600 text-sm font-medium text-center">
            {errors.root.message}
          </p>
        )}

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            disabled={isSubmitting}
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="flex justify-between">
          <p className="text-gray-600 text-sm">
            Need an account?
            <Link
              to="/signup"
              className="text-fuchsia-600 ml-1 hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-sm hover:text-fuchsia-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
            hover:bg-fuchsia-800 transition-all disabled:bg-fuchsia-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center cursor-pointer">or</p>
          <GoogleAuthButton mode="login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
