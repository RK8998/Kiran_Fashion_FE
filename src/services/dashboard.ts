import { Axios } from './webRequest';

export const getDashboardDataService = (params: { [key: string]: any }) => {
  return Axios.get('/dashboard', { params });
};
