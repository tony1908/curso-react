import { PropertyGrid } from "../features/properties";
import { SearchBar } from "../features/properties";
import OneSignal from "react-onesignal";
import { useEffect } from "react";
import RemotePropertyApp from "../shared/ui/RemotePropertyApp";


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
            <RemotePropertyApp />
        </>
    )
}

export default HomePage;