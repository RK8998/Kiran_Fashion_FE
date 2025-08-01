import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { localStorageHandler, AUTH_TOKEN } from '@/helpers/storage';

const authToken = localStorageHandler('GET', AUTH_TOKEN);
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export const Axios = axios.create({
  baseURL,
  headers: {
    Authorization: `token ${authToken}`,
  },
});

// Add request interceptor
Axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authToken = localStorageHandler('GET', AUTH_TOKEN);

    if (config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
Axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error?.response?.status;
    const data: any = error?.response?.data;

    if (status === 401 || data?.status === 401) {
      localStorageHandler('REMOVE', AUTH_TOKEN);
      // window.location.reload(); // Or redirect to login if needed
      window.location.href = '/login';

      return;
    }

    return Promise.reject(error);
  }
);
