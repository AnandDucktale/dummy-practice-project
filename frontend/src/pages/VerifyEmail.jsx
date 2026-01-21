import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import api from '../api/axios';
import useAuthStore from '../hooks/store/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Yup validation schema
const verifyEmailSchema = Yup.object({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const { setAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: { otp: '' },
  });

  // Ensure email exists (redirect otherwise)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/signup');
    }
  }, [location, navigate]);

  // Submit handler
  const onSubmit = async (values) => {
    try {
      const response = await api.post(
        '/user/verifyEmail',
        { email, userOtp: values.otp },
        { headers: { 'Content-Type': 'application/json' } }
      );

      toast.success('Email verified successfully', {
        position: 'top-center',
        theme: 'colored',
      });

      // Auth store
      setAuth(response.data.user, response.data.accessToken);

      // Refresh token
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
        'Invalid OTP. Please try again.';

      // Root-level error
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
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-600 text-sm">
          Enter the 6-digit OTP sent to <br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>

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
          {/* OTP */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Enter OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              {...register('otp')}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-fuchsia-600 outline-none tracking-widest text-center"
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
            hover:bg-fuchsia-800 transition-all disabled:bg-fuchsia-300"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Back */}
          <p className="text-center text-gray-600 text-sm">
            Entered wrong email?
            <span
              onClick={() => navigate('/signup')}
              className="text-fuchsia-600 ml-1 cursor-pointer hover:underline"
            >
              Go back
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
