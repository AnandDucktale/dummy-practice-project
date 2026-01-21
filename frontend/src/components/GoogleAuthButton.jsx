import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import useAuthStore from '../hooks/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const GoogleAuthButton = ({ mode }) => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      const response = await api.post(
        '/user/auth/google',
        {
          googleToken,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // console.log(response);

      // Store in Zustand
      setAuth(response.data.user, response.data.accessToken);

      // local storage
      localStorage.setItem('refreshToken', response.data.refreshToken);

      // console.log('Google ID Token:', token);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Google auth failed', error);
    }
  };
  return (
    <>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login Failed')}
        text={mode === 'signup' ? 'signup_with' : 'signin_with'}
      />
    </>
  );
};

export default GoogleAuthButton;
