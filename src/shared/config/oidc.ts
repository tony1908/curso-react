const oidcConfig = {
    authority: 'https://localhost:9443/oauth2/oidcdiscovery',
    client_id: '37CBlrbLPsP36NaheYAS7vbpde4a',
    redirect_uri: 'http://localhost:5173/callback',
    post_logout_redirect_uri: 'http://localhost:5173',
    response_type: 'code',
    scope: 'openid profile email groups',

    loadUserInfo: true,

    storeUser: false,
    
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:5173/silent-callback',

    metadata: {
        issuer: 'https://localhost:9443/oauth2/oidcdiscovery',
        authorization_endpoint: 'https://localhost:9443/oauth2/authorize',
        token_endpoint: 'https://localhost:9443/oauth2/token',
        userinfo_endpoint: 'https://localhost:9443/oauth2/userinfo',
        end_session_endpoint: 'https://localhost:9443/oauth2/logout',
        jwks_uri: 'https://localhost:9443/oauth2/jwks',
        introspection_endpoint: 'https://localhost:9443/oauth2/introspect',
        revocation_endpoint: 'https://localhost:9443/oauth2/revoke',
    },

    fetchRequestCredentials: 'include',
    
}

export default oidcConfig