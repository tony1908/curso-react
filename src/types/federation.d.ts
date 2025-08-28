declare module 'cards/PropertyGrid' {
  interface PropertyGridProps {
    searchTerm?: string;
    onPropertyClick?: (id: number) => void;
  }
  const PropertyGrid: React.ComponentType<PropertyGridProps>
  export default PropertyGrid
}

declare module 'cards/PropertyCard' {
  interface PropertyCardProps {
    id: number;
    image: string;
    rating: number;
    title: string;
    type: string;
    location: string;
    details: string;
    host: string;
    price: number;
    onNavigate?: (id: number) => void;
  }
  const PropertyCard: React.ComponentType<PropertyCardProps>
  export default PropertyCard
}