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
  
  // For development with self-signed certificates
  extraQueryParams: {},
  
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