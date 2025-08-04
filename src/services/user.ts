import { Axios } from './webRequest';

import { UserFormTypes } from '@/constants/formTypes';

export const getUsersListService = (params: { [key: string]: any }) => {
  return Axios.get('/users', { params });
};

export const getUserByIdService = (id: string, params: { [key: string]: any }) => {
  return Axios.get(`/users/${id}`, { params });
};

export const createUsersService = (data: UserFormTypes) => {
  return Axios.post('/users', data);
};

export const deleteUsersService = (id: string | null) => {
  return Axios.delete(`/users/${id}`);
};

export const updateUsersService = (id: string, data: UserFormTypes) => {
  return Axios.put(`/users/${id}`, data);
};
