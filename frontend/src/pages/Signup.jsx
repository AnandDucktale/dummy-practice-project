import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../api/axios';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const signupSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(15, 'First name must be at most 15 characters'),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(20, 'Last name must be at most 20 characters'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters'),
});

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // Submit handler
  const onSubmit = async (values) => {
    try {
      await api.post('/user/signup', values, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Account created successfully', {
        position: 'top-center',
        theme: 'colored',
      });

      setTimeout(() => {
        navigate('/verify-email', { state: { email: values.email } });
      }, 1200);
    } catch (error) {
      const message =
        error?.message ||
        error?.response?.data.message ||
        'Signup failed. Please try again.';
      console.log(error);

      // setError('root', { message });

      toast.error(message, {
        position: 'top-center',
        theme: 'colored',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <ToastContainer
          position="top-center"
          theme="colored"
          autoClose={3000}
        />

        {errors.root && (
          <p className="text-red-600 text-sm font-medium text-center">
            {errors.root.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              First Name
            </label>
            <input
              type="text"
              {...register('firstName')}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Last Name
            </label>
            <input
              type="text"
              {...register('lastName')}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
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

          {/* Login redirect */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?
            <span
              onClick={() => navigate('/login')}
              className="text-fuchsia-600 ml-1 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

          {/* Submit */}
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
              hover:bg-fuchsia-800 transition-all disabled:bg-fuchsia-300"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="text-center">or</p>
            <GoogleAuthButton mode="signup" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
