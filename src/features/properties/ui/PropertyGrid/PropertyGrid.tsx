import { PropertyCard } from "../PropertyCard";
import { useEffect, useMemo } from "react";
import './PropertyGrid.css'
import { usePropertiesStore } from "../../model/store";
import { type Property } from "../../model/types";

function PropertyGrid() {
    const loadProperties = usePropertiesStore((state) => state.loadProperties);
    const properties = usePropertiesStore((state) => state.properties);
    const loading = usePropertiesStore((state) => state.loading);
    const searchTerm = usePropertiesStore((state) => state.searchTerm);

    useEffect(() => {
        loadProperties();
    }, []);

    const sortedProperties = useMemo(() => {
        const filteredProperties = !searchTerm
            ? properties
            : properties.filter((property: Property) => {
                return property.location.toLowerCase().includes(searchTerm.toLowerCase());
            });
        return filteredProperties.sort((a, b) => {
            return b.rating - a.rating;
        });
    }, [properties, searchTerm]);
    

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