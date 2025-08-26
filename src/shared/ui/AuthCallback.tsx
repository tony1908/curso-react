import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import LoadingSpinner from './LoadingSpinner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (auth.error) {
      console.error('Authentication error:', auth.error);
      navigate('/', { replace: true });
    }
  }, [auth.error, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <LoadingSpinner />
      <p>Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;