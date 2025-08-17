import { Axios } from './webRequest';

import { SalesFormTypes } from '@/constants/formTypes';

export const getSalesListService = (params: { [key: string]: any }) => {
  return Axios.get('/sales', { params });
};

export const getSalesByIdService = (id: string, params: { [key: string]: any }) => {
  return Axios.get(`/sales/${id}`, { params });
};

export const createSalesService = (data: SalesFormTypes) => {
  return Axios.post('/sales', data);
};

export const deleteSalesService = (id: string | null) => {
  return Axios.delete(`/sales/${id}`);
};

export const updateSalesService = (id: string, data: SalesFormTypes) => {
  return Axios.put(`/sales/${id}`, data);
};
