import { SearchBar } from "../features/properties";
import RemotePropertyGrid from "../components/RemotePropertyGrid";
import OneSignal from "react-onesignal";
import { useEffect } from "react";
import { usePropertiesStore } from "../features/properties/model/store";


function HomePage() {
    const searchTerm = usePropertiesStore((state: any) => state.searchTerm);
    
    useEffect(() => {
        OneSignal.init({
            appId: "",
            allowLocalhostAsSecureOrigin: true,
        });
    }, []);

    return (
        <>
            <SearchBar />
            <RemotePropertyGrid searchTerm={searchTerm} />
        </>
    )
}

export default HomePage;