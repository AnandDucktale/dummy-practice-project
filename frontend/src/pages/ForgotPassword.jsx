import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CgDanger } from 'react-icons/cg';
import { MdFileDownloadDone } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Send OTP
  const handleEmailSubmission = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setIsSendingOtp(true);

      const response = await api.post('/user/resetPassSendOtp', { email });

      if (response.status === 200) {
        setIsOtpSent(true);
        setSuccess('OTP sent to your email');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP
  const handleOTPSubmission = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      setError('');
      setIsVerifyingOtp(true);

      const response = await api.post('/user/resetPassVerifyOtp', {
        email,
        userOtp: otp,
      });

      const resetToken = response.data.resetToken;

      navigate('/set-new-password', {
        state: { resetToken, email },
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <form onSubmit={handleEmailSubmission} className="space-y-3">
          <label className="block font-medium text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            disabled={isOtpSent}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-b-2 border-gray-300
                       focus:border-fuchsia-600 outline-none
                       disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={isSendingOtp || isOtpSent}
            className="w-full px-6 py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
                       hover:bg-fuchsia-800
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        {isOtpSent && (
          <form onSubmit={handleOTPSubmission} className="space-y-3">
            <label className="block font-medium text-gray-700">
              One-Time Password
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-300
                         focus:border-fuchsia-600 outline-none"
            />

            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="w-full px-6 py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
                         hover:bg-fuchsia-800
                         disabled:opacity-50
                         disabled:cursor-not-allowed"
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {error && (
          <p className="flex justify-center items-center gap-1 text sm text-red-400 ">
            <span className="mt-1">
              <CgDanger />
            </span>
            <p>{error}</p>
          </p>
        )}

        {success && (
          <p className="flex justify-center items-center gap-1 text sm text-green-400 ">
            <span className="mt-1">
              <MdFileDownloadDone />
            </span>
            <p>{success}</p>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
