import axios from "axios";
import axiosRetry from "axios-retry";

const API_BASE_URL = 'https://91c48a924bb9.ngrok-free.app';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});


axiosRetry(apiClient, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return error.response?.status === 500;
    },
});
    