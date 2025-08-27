import { useAuth } from 'react-oidc-context'
import { useEffect } from 'react'

const SilentCallback = () => {
    const auth = useAuth();

    useEffect(() => {

    },[auth])
    
    return (
        <div>
            <h1>Processing authentication...</h1>
        </div>
    )
}

export default SilentCallback
