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