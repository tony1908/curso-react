import { useState } from 'react'
import { useAuthContext } from '../shared/hooks/AuthContext'

function ProfilePage() {
    const { user } = useAuthContext()

    if (!user) {
        return <div>Loading...</div>
    }

    const formatClaim = (_key: string, value: any) => {
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
    
    return (
        <div>
            Soy la profile page: {user?.profile?.username}
        </div>
    )
}

export default ProfilePage;