import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"; 
import { usePropertiesStore } from "../../features/properties/model/store";
import { useEffect } from "react";

const PropertyApp = React.lazy(() => import('propertyService/PropertyApp'));

const RemotePropertyApp = () => {
    const loadProperties = usePropertiesStore((state) => state.loadProperties);
    const properties = usePropertiesStore((state) => state.properties);

    useEffect(() => {
        loadProperties();
    }, []);
    
    return (
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<div>Loading...</div>}>
                <PropertyApp properties={properties}/>
            </Suspense>
        </ErrorBoundary>
    )
}

export default RemotePropertyApp;