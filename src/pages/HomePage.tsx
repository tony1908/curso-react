import { PropertyGrid } from "../features/properties";
import { SearchBar } from "../features/properties";
import { useAuth } from "../shared/hooks/useAuth";


function HomePage() {
    const { login } = useAuth()

    const handleLogin = () => {
        login()
    }

    return (
        <>
            <SearchBar />
            <PropertyGrid />
            <div>
                <button onClick={handleLogin}>
                    Login
                </button>
            </div>
        </>
    )
}

export default HomePage;