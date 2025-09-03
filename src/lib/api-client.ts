import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Create a configured axios instance
const createApiClient = (): AxiosInstance => {
  const baseURL =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  const client = axios.create({
    baseURL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for debugging
  client.interceptors.request.use(
    (config) => {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error('[API] Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[API] Response ${response.status} for ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('[API] Response error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });

      // Provide user-friendly error messages
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout - please try again';
      } else if (error.response?.status === 404) {
        error.message = 'API endpoint not found';
      } else if (error.response?.status >= 500) {
        error.message = 'Server error - please try again later';
      } else if (!error.response) {
        error.message = 'Network error - please check your connection';
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();
