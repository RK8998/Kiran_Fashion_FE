import { AxiosResponse } from 'axios';

import { Axios } from './webRequest';

import { LoginFormTypes } from '@/constants/formTypes';

export const loginService = (data: LoginFormTypes): Promise<AxiosResponse<any, any>> => {
  return Axios.post(`/auth/login`, data);
};
