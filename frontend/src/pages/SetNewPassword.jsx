import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CgDanger } from 'react-icons/cg';

import api from '../api/axios';

const SetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [resetToken, navigate]);

  const handlePasswordSubmission = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      await api.post('/user/resetPassword', {
        userResetToken: resetToken,
        newPassword,
      });

      navigate('/login');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Set New Password
        </h2>

        <form onSubmit={handlePasswordSubmission} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-300
                         focus:border-fuchsia-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-gray-300
                         focus:border-fuchsia-600 outline-none"
            />
          </div>

          {error && (
            <p className="flex justify-center items-center gap-1 text sm text-red-400 ">
              <span className="mt-1">
                <CgDanger />
              </span>
              <p>{error}</p>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-fuchsia-600 text-white rounded-lg font-semibold
                       hover:bg-fuchsia-800
                       disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;
