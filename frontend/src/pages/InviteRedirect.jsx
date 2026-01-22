import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import api from '../api/axios';

const InviteRedirect = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  //   console.log(token);
  useEffect(() => {
    (async () => {
      await validateInvite(token);
    })();
  }, []);

  const validateInvite = async (token) => {
    try {
      const params = {
        token: token,
      };
      const response = await api.get('/group/validateInviteToken', {
        params: params,
      });
      // console.log(response);
      if (response.status === 200) {
        localStorage.setItem('inviteToken', token);
        navigate('/groups');
      }
    } catch (error) {
      // console.log(error);
      if (error.response.status === 401) {
        toast.error(error?.message || 'Invalid Token', {
          position: 'top-center',
          theme: 'colored',
          autoClose: 3000,
        });
        setTimeout(() => navigate('/groups'), 1000);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} />
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="animate-spin border-4 border-t-4 border-r-4 border-b-4 border-fuchsia-200 border-t-fuchsia-700 border-r-fuchsia-700 border-b-fuchsia-700 rounded-full w-12 h-12"></div>
      </div>
    </>
  );
};

export default InviteRedirect;
