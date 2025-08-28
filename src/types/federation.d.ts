declare module 'propertyService/PropertyApp' {
    interface PropertyAppProps {
        properties: Property[];
    }
    const PropertyApp: React.ComponentType<PropertyAppProps>;
    export default PropertyApp;
}