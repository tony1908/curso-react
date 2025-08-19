import { useState } from 'react'

interface AuthState {
    isAuthenticated: boolean
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false
    })

    const login = () => {
        setAuthState({
            isAuthenticated: true
        })
    }

    return {
        isAuthenticated: authState.isAuthenticated,
        login
    }
}