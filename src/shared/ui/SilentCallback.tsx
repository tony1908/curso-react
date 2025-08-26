import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

const SilentCallback: React.FC = () => {
  const auth = useAuth();

  useEffect(() => {
    // Silent callback is handled automatically by the OIDC library
    // This component just needs to exist for the redirect
  }, [auth]);

  return <div>Processing silent authentication...</div>;
};

export default SilentCallback;