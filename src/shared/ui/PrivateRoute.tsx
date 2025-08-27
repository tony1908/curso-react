import { useAuthContext } from '../hooks/AuthContext'

interface PrivateRouteProps {
    children: React.ReactNode,
    roles?: string[],
    fallback?: React.ReactNode
}

function PrivateRoute({ children, roles, fallback }: PrivateRouteProps) {
    const { isAuthenticated, isLoading, login } = useAuthContext()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return (
            <div>
                <h1>You are not authenticated</h1>
                <button onClick={login}>Login</button>
            </div>
        )
    }

    return <>{children}</>

}

export default PrivateRoute;