import { PropertyGrid } from "../features/properties";
import { SearchBar } from "../features/properties";
import OneSignal from "react-onesignal";
import { useEffect } from "react";


function HomePage() {
    useEffect(() => {
        OneSignal.init({
            appId: "",
            allowLocalhostAsSecureOrigin: true,
        });


            
    }, []);

    return (
        <>
            <SearchBar />
            <PropertyGrid />
        </>
    )
}

export default HomePage;