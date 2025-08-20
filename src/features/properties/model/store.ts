import { create } from "zustand";
import { PropertiesApi } from "../api/propertiesApi";

export const usePropertiesStore = create((set, get) => ({
    properties: [],
    loading: false,
    searchTerm: "",
    sortedProperties: [],
    loadProperties: async () => {
        set({loading: true});

        const properties = await PropertiesApi.getProperties();

        set({
            properties,
            sortedProperties: properties,
            loading: false,
        })
    },
    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
    },
    searchProperties: async (location: string) => {
        const state = get();
        if (location.trim() === "") {
          set({
            sortedProperties: state.properties,
          })
        } else {
          set({ loading: true });

          const properties = await PropertiesApi.searchProperties(location);

          set({
              sortedProperties: properties,
              loading: false,
          })
        }
    },
}));