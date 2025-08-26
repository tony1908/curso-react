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

  const getAllClaims = () => {
    const profile = (user as any)?.profile || {};
    const criticalClaimKeys = Object.keys(getCriticalClaims()).map(k => k.toLowerCase().replace(/[^a-z]/g, ''));
    
    return Object.keys(profile)
      .filter(key => !criticalClaimKeys.includes(key.toLowerCase().replace(/[^a-z]/g, '')))
      .reduce((obj: Record<string, unknown>, key) => {
        obj[key] = profile[key];
        return obj;
      }, {});
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>User Profile</h1>
      <p>Your OpenID Connect claims and profile information.</p>
      
      <div>
        <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>📝 Basic Information</h2>
          <div>
            {Object.entries(getCriticalClaims()).map(([label, value]) => (
              <div key={label} style={{ margin: '10px 0', display: 'flex', flexDirection: 'column' }}>
                <strong style={{ marginBottom: '5px' }}>{label}:</strong>
                <span style={{ padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
                  {Array.isArray(value) ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {value.map((item: unknown, index: number) => (
                        <li key={index}>{String(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    formatClaim(label, value)
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>🔧 Additional Claims</h2>
          <div>
            {Object.keys(getAllClaims()).length > 0 ? (
              Object.entries(getAllClaims()).map(([key, value]) => (
                <div key={key} style={{ margin: '10px 0', display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ marginBottom: '5px' }}>{key}:</strong>
                  <span style={{ padding: '5px', background: '#f5f5f5', borderRadius: '4px' }}>
                    {formatClaim(key, value)}
                  </span>
                </div>
              ))
            ) : (
              <p>No additional claims available</p>
            )}
          </div>
        </section>

        <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>🔐 Token Information</h2>
          <div>
            <button 
              onClick={() => setShowTokens(!showTokens)}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              {showTokens ? 'Hide' : 'Show'} Token Details
            </button>
            
            {showTokens && (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <h4>Access Token (truncated):</h4>
                  <code style={{ 
                    display: 'block',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px',
                    wordBreak: 'break-all'
                  }}>
                    {(user as any).access_token ? 
                      `${(user as any).access_token.substring(0, 50)}...` : 
                      'Not available'
                    }
                  </code>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4>ID Token (truncated):</h4>
                  <code style={{ 
                    display: 'block',
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    fontSize: '12px',
                    wordBreak: 'break-all'
                  }}>
                    {(user as any).id_token ? 
                      `${(user as any).id_token.substring(0, 50)}...` : 
                      'Not available'
                    }
                  </code>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4>Token Type:</h4>
                  <span>{(user as any).token_type || 'Bearer'}</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4>Scope:</h4>
                  <span>{(user as any).scope || 'Not specified'}</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4>Expires At:</h4>
                  <span>
                    {(user as any).expires_at ? 
                      new Date((user as any).expires_at * 1000).toLocaleString() : 
                      'Unknown'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>🛡️ Security Information</h2>
          <div>
            <div style={{ margin: '10px 0' }}>
              <strong>Authentication Time:</strong>
              <span style={{ marginLeft: '10px' }}>
                {(user as any).profile?.auth_time ? 
                  new Date((user as any).profile.auth_time * 1000).toLocaleString() : 
                  'Not available'
                }
              </span>
            </div>
            <div style={{ margin: '10px 0' }}>
              <strong>Authentication Method:</strong>
              <span style={{ marginLeft: '10px' }}>
                {(user as any).profile?.amr?.join(', ') || 'Not specified'}
              </span>
            </div>
            <div style={{ margin: '10px 0' }}>
              <strong>Authorized Party:</strong>
              <span style={{ marginLeft: '10px' }}>
                {(user as any).profile?.azp || 'Not specified'}
              </span>
            </div>
            <div style={{ margin: '10px 0' }}>
              <strong>Session State:</strong>
              <span style={{ marginLeft: '10px' }}>
                {(user as any).session_state || 'Not available'}
              </span>
            </div>
          </div>
        </section>

        <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h2>🔍 Raw User Object (Debug)</h2>
          <details>
            <summary style={{ cursor: 'pointer', padding: '10px 0' }}>
              Click to expand full user object
            </summary>
            <pre style={{ 
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;