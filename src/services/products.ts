import { Axios } from './webRequest';

import { ProductFormTypes } from '@/constants/formTypes';

export const getProductsListService = (params: { [key: string]: any }) => {
  return Axios.get('/products', { params });
};

export const getProductByIdService = (id: string, params: { [key: string]: any }) => {
  return Axios.get(`/products/${id}`, { params });
};

export const createProductsService = (data: ProductFormTypes) => {
  return Axios.post('/products', data);
};

export const deleteProductsService = (id: string | null) => {
  return Axios.delete(`/products/${id}`);
};

export const updateProductsService = (id: string, data: ProductFormTypes) => {
  return Axios.put(`/products/${id}`, data);
};
