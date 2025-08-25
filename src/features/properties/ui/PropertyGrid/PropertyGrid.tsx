import { PropertyCard } from "../PropertyCard";
import { useEffect, useMemo, useState } from "react";
import './PropertyGrid.css'
import { usePropertiesStore } from "../../model/store";
import { type Property } from "../../model/types";
import { PropertiesApi } from "../../api/propertiesApi";

function PropertyGrid() {
    const loadProperties = usePropertiesStore((state) => state.loadProperties);
    const properties = usePropertiesStore((state) => state.properties);
    //const sortedProperties = usePropertiesStore((state) => state.sortedProperties);
    const loading = usePropertiesStore((state) => state.loading);
    const searchTerm = usePropertiesStore((state) => state.searchTerm);
    //const searchProperties = usePropertiesStore((state) => state.searchProperties);

    const [sortedProperties, setSortedProperties] = useState<Property[]>([]);

    useEffect(() => {
        loadProperties();
    }, []);

    useEffect(() => {
        setSortedProperties(properties);
    }, [properties]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSortedProperties(properties);
            return;
        }
        
        const controller = new AbortController();
        const searchProperties = async () => {
            const properties = await PropertiesApi.searchProperties(searchTerm, controller.signal);
            setSortedProperties(properties);
        }
        searchProperties();
        
        return () => {
            controller.abort();
        }
    }, [searchTerm]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="property-grid-container"> 
            <h1>Popular Destinations</h1>
            <div className="property-grid">
                {sortedProperties.map((property: Property) => (
                    <PropertyCard 
                        key={property.id}
                        {...property}
                    />
                ))}
            </div>
        </div>
    )
}

export default PropertyGrid