import { useAuth } from "../hooks/useAuth";
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return (
            <Navigate to='/' replace/>
        )
    }

    return (
        <>{children}</>
    )

}

export default PrivateRoute;