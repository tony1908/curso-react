import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider as OidcAuthProvider, useAuth } from 'react-oidc-context';
import oidcConfig from '../config/oidc';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
  error: unknown;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  const authContextValue: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login: () => auth.signinRedirect(),
    logout: async () => {
      // Clear local session first
      await auth.removeUser();
      
      // Direct logout to WSO2 IS with proper redirect
      const logoutUrl = `https://localhost:9443/oidc/logout?post_logout_redirect_uri=${encodeURIComponent('http://localhost:5173')}`;
      window.location.href = logoutUrl;
    },
    isLoading: auth.isLoading,
    error: auth.error
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </OidcAuthProvider>
  );
};