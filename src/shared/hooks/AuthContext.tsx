import React, { createContext, useContext } from 'react'
import { useAuth, AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import oidcConfig  from '../config/oidc';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
    error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
}

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  const authContextValue: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login: () => auth.signinRedirect(),
    logout: async () => {
        await auth.removeUser();

        const logoutUrl = `https://localhost:9443/oidc/logout?post_logout_redirect_uri=${encodeURIComponent('http://localhost:5173')}`;
        window.location.href = logoutUrl;
    },
    isLoading: auth.isLoading,
    error: auth.error,
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
  
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <OidcAuthProvider {...oidcConfig}>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </OidcAuthProvider>
    );
}