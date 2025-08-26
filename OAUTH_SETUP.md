# OAuth Authentication Setup Tutorial

This tutorial explains how to implement OAuth authentication using WSO2 Identity Server in a React application with TypeScript and Vite.

## Overview

This implementation uses OpenID Connect (OIDC) with the Authorization Code flow and PKCE for enhanced security. The authentication system provides:

- Secure OAuth 2.0 / OpenID Connect authentication
- User profile management with detailed claims
- Protected routes with role-based access control
- Automatic token renewal
- Comprehensive error handling

## Prerequisites

- WSO2 Identity Server running on `https://localhost:9443`
- React application with TypeScript and Vite
- Router setup (React Router v6+)

## Installation

Install the required OAuth dependencies:

```bash
npm install oidc-client-ts react-oidc-context
```

## Step 1: OAuth Configuration

Create `src/shared/config/oidc.ts`:

```typescript
const oidcConfig = {
  authority: 'https://localhost:9443/oauth2/oidcdiscovery',
  client_id: import.meta.env.VITE_CLIENT_ID || 'react-oidc-client',
  redirect_uri: 'http://localhost:5173/callback',
  post_logout_redirect_uri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || 'http://localhost:5173',
  response_type: 'code',
  scope: 'openid profile email groups',
  
  // PKCE for security
  loadUserInfo: true,
  
  // Token storage in memory for security
  storeUser: false,
  
  // Automatic silent renew
  automaticSilentRenew: true,
  silent_redirect_uri: 'http://localhost:5173/silent-callback',
  
  // Additional security settings
  filterProtocolClaims: true,
  clockSkew: 300,
  
  // Metadata configuration for WSO2 IS
  metadata: {
    issuer: 'https://localhost:9443/oauth2/token',
    authorization_endpoint: 'https://localhost:9443/oauth2/authorize',
    token_endpoint: 'https://localhost:9443/oauth2/token',
    userinfo_endpoint: 'https://localhost:9443/oauth2/userinfo',
    end_session_endpoint: 'https://localhost:9443/oidc/logout',
    jwks_uri: 'https://localhost:9443/oauth2/jwks',
    introspection_endpoint: 'https://localhost:9443/oauth2/introspect',
    revocation_endpoint: 'https://localhost:9443/oauth2/revoke'
  },
  
  // Custom fetch for handling self-signed certificates in development
  fetchRequestCredentials: 'include'
};

export default oidcConfig;
```

## Step 2: Authentication Context

Create `src/shared/contexts/AuthContext.tsx`:

```typescript
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
```

## Step 3: OAuth Callback Components

### Authentication Callback

Create `src/shared/ui/AuthCallback.tsx`:

```typescript
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
```

### Silent Callback

Create `src/shared/ui/SilentCallback.tsx`:

```typescript
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
```

## Step 4: Protected Route Component

Update `src/shared/ui/PrivateRoute.tsx`:

```typescript
import type { ReactNode } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

interface PrivateRouteProps {
    children: ReactNode
    roles?: string[]
    fallback?: ReactNode
}

function PrivateRoute({ 
    children, 
    roles = [], 
    fallback = <div>Access Denied</div> 
}: PrivateRouteProps) {
    const { isAuthenticated, isLoading, user, login } = useAuthContext()

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                padding: '20px'
            }}>
                <h2>Authentication Required</h2>
                <p>You must be logged in to access this page.</p>
                <button 
                    onClick={login}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Login
                </button>
            </div>
        )
    }

    // Check roles if specified
    if (roles.length > 0 && user) {
        const userRoles = (user as any).groups || (user as any).roles || []
        const hasRequiredRole = roles.some(role => 
            userRoles.includes(role) || userRoles.includes(`Internal/${role}`)
        )
        
        if (!hasRequiredRole) {
            return <>{fallback}</>
        }
    }

    return <>{children}</>
}

export default PrivateRoute;
```

## Step 5: Profile Page

Create a comprehensive profile page at `src/pages/ProfilePage.tsx`:

```typescript
import { useState } from 'react';
import { useAuthContext } from '../shared/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const [showTokens, setShowTokens] = useState(false);

  if (!user) {
    return <div>Loading user information...</div>;
  }

  const formatClaim = (_key: string, value: unknown): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return String(value || 'Not provided');
  };

  const getCriticalClaims = () => {
    const userObj = user as any;
    return {
      'Subject (sub)': userObj.profile?.sub,
      'Name': userObj.profile?.name,
      'Given Name': userObj.profile?.given_name,
      'Family Name': userObj.profile?.family_name,
      'Email': userObj.profile?.email,
      'Email Verified': userObj.profile?.email_verified,
      'Username': userObj.profile?.preferred_username,
      'Groups/Roles': userObj.profile?.groups || userObj.groups,
      'Audience': userObj.profile?.aud,
      'Issuer': userObj.profile?.iss,
      'Issued At': userObj.profile?.iat ? new Date(userObj.profile.iat * 1000).toLocaleString() : null,
      'Expires At': userObj.profile?.exp ? new Date(userObj.profile.exp * 1000).toLocaleString() : null,
    };
  };

  // ... rest of the component implementation
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>User Profile</h1>
      <p>Your OpenID Connect claims and profile information.</p>
      
      {/* Profile sections with user information, tokens, and security details */}
    </div>
  );
};

export default ProfilePage;
```

## Step 6: App Integration

Update your main `App.tsx`:

```typescript
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../shared/contexts/AuthContext'
import LoadingSpinner from '../shared/ui/LoadingSpinner'
import PrivateRoute from '../shared/ui/PrivateRoute'
import AuthCallback from '../shared/ui/AuthCallback'
import SilentCallback from '../shared/ui/SilentCallback'

const HomePage = lazy(() => import('../pages/HomePage'))
const PropertyDetailsPage = lazy(() => import('../pages/PropertyDetailsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ChatPage = lazy(() => import('../pages/ChatPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner/>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/callback" element={<AuthCallback />} />
            <Route path="/silent-callback" element={<SilentCallback />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage/>
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App
```

## Step 7: WSO2 Identity Server Configuration

### 1. Create OAuth Application

In WSO2 Identity Server:

1. Go to **Applications** > **Service Providers**
2. Click **Add** to create a new service provider
3. Enter a name (e.g., "React OIDC Client") and click **Register**

### 2. Configure OAuth Settings

1. Expand **Inbound Authentication Configuration**
2. Click **OAuth/OpenID Connect Configuration** > **Configure**
3. Set the following:
   - **Callback Url**: `http://localhost:5173/callback`
   - **Grant Types**: Select "Authorization Code"
   - **PKCE**: Enable "PKCE Mandatory"
   - **Token Endpoint Authentication Method**: "None" (for public clients)

### 3. Configure Claims

1. Go to **Claims Configuration**
2. Add the required claims (groups, email, profile, etc.)
3. Enable **Use Local Claim Dialect**

## Step 8: Environment Variables

Create a `.env` file:

```env
VITE_CLIENT_ID=your_client_id_from_wso2
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
```

## Features Implemented

### Security Features

- **PKCE (Proof Key for Code Exchange)**: Enhanced security for public clients
- **In-Memory Token Storage**: Tokens are not persisted to localStorage
- **Automatic Token Renewal**: Silent refresh to maintain session
- **Secure Logout**: Proper logout with WSO2 IS

### User Profile Features

- **Comprehensive User Information**: Display all OIDC claims
- **Token Information**: View access tokens, ID tokens, and metadata
- **Security Details**: Authentication time, methods, and session state
- **Debug Information**: Raw user object for development

### Route Protection

- **Authentication Required**: Redirect to login for protected routes
- **Role-Based Access Control**: Support for role-based permissions
- **Loading States**: Proper loading indicators during auth checks

## Usage

### Basic Authentication

```typescript
import { useAuthContext } from '../shared/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuthContext();
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {(user as any).profile?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes with Roles

```typescript
<Route path="/admin" element={
  <PrivateRoute 
    roles={['admin']}
    fallback={<div>Admin access required</div>}
  >
    <AdminPanel />
  </PrivateRoute>
} />
```

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/profile` in your browser
3. You should see the login prompt
4. Click "Login" to authenticate with WSO2 IS
5. After successful authentication, view your profile information

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure WSO2 IS is configured to allow your domain
2. **Certificate Issues**: For development, you may need to accept self-signed certificates
3. **Redirect Issues**: Verify callback URLs match exactly in WSO2 IS configuration
4. **Token Errors**: Check that scopes and claims are properly configured

### Debug Mode

Enable debug logging by adding to your OIDC config:

```typescript
const oidcConfig = {
  // ... other config
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  // Enable for debugging
  // silent_redirect_uri: 'http://localhost:5173/silent-callback?debug=1'
};
```

## Security Considerations

1. **Never expose client secrets** in frontend applications
2. **Use PKCE** for all OAuth flows
3. **Store tokens in memory** only, not in localStorage
4. **Validate tokens** and implement proper error handling
5. **Use HTTPS** in production
6. **Implement proper CORS** policies

## Production Deployment

1. Update all URLs to production endpoints
2. Configure proper SSL certificates
3. Set up proper CORS policies
4. Implement error monitoring and logging
5. Test token renewal and logout flows

This implementation provides a secure, production-ready OAuth authentication system for React applications using WSO2 Identity Server.