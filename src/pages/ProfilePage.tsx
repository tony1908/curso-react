import { useEffect } from 'react'
import { useAuthContext } from '../shared/hooks/AuthContext'

function ProfilePage() {
    const { user, logout } = useAuthContext()

    if (!user) {
        return <div>Loading...</div>
    }

    useEffect(() => {
        console.log(user)
    }, [user])


    
    return (
        <div>
            Soy la profile page: {user?.profile?.username}  {user?.profile?.email}
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default ProfilePage;