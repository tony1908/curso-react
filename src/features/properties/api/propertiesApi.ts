import { apiClient } from "../../../shared/api/client";
import { type Property } from "../model/types";

export class PropertiesApi {
    static async getProperties(): Promise<Property[]> {
        try {
            const response = await apiClient.get('/properties');
            return response.data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }
    static async searchProperties(location: string): Promise<Property[]> {
        try {
            const response = await apiClient.get(`/properties/location/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }
}