import { create } from "zustand";
import { type Property } from "./types";

const mockProperties: Property[] = [
    {
      id: 1,
      title: "Cozy Beachfront Villa",
      type: "Entire villa",
      price: 250,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      location: "Malibu, California",
      host: "Sarah",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    },
    {
      id: 2,
      title: "Mountain Retreat Cabin",
      type: "Entire cabin",
      price: 180,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      location: "Aspen, Colorado",
      host: "Mike",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    },
    {
      id: 3,
      title: "Modern City Apartment",
      type: "Entire apartment",
      price: 120,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      location: "New York, NY",
      host: "Emma",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    },
    {
      id: 4,
      title: "Rustic Farmhouse",
      type: "Entire house",
      price: 200,   
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&h=300&fit=crop",
      location: "Tuscany, Italy",
      host: "Antonio",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    },
    {
      id: 5,
      title: "Tropical Paradise Bungalow",
      type: "Entire bungalow",
      price: 95,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      location: "Bali, Indonesia",
      host: "Ketut",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    },
    {
      id: 6,
      title: "Historic Downtown Loft",
      type: "Entire loft",
      price: 140,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop",
      location: "Portland, Oregon",
      host: "Jessica",
      details: "2 bedrooms, 2 bathrooms, 1000 sqft"
    }
  ]

const fakeFetchProperties = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockProperties);
        }, 1000);
    });
}

export const usePropertiesStore = create((set) => ({
    properties: [],
    loading: false,
    searchTerm: "",
    loadProperties: async () => {
        set({loading: true});

        const properties = await fakeFetchProperties();

        set({
            properties,
            loading: false,
        })
    },
    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
    },
}));