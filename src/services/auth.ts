import axios, { AxiosResponse } from 'axios';

import { LoginFormTypes } from '@/constants/formTypes';

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

export const loginService = (data: LoginFormTypes): Promise<AxiosResponse<any, any>> => {
  return axios.post(`${baseURL}/auth/login`, data);
};
