import axios from "axios";
import axiosRetry from "axios-retry";
import Logger from "../lib/logger";

const API_BASE_URL = 'https://91c48a924bb9.ngrok-free.app';
const myLogger = new Logger();

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

apiClient.interceptors.request.use(
    (config) => {
        myLogger.info(config.url || '');
        return config;
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        myLogger.info(error);
        return Promise.reject(error);
    }
); 

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

