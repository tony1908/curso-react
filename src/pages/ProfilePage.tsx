import { useState, useEffect } from 'react'
import { useAuthContext } from '../shared/hooks/AuthContext'

function ProfilePage() {
    const { user, logout } = useAuthContext()

    if (!user) {
        return <div>Loading...</div>
    }

    useEffect(() => {
        console.log(user)
    }, [user])

    const formatClaim = (value: any) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value)
        }
        if (typeof value === 'boolean') {
            return value ? 'true' : 'false'
        }

        if (typeof value === 'number') {
            return value.toString()
        }

        return String(value || '')
    }

    const checkUsername = () => {
        if (formatClaim(user?.profile?.username) == "admin") {
            return "admin"
        }
        return "user";
    }
    
    return (
        <div>
            Soy la profile page: {user?.profile?.username}  {user?.profile?.email}
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default ProfilePage;