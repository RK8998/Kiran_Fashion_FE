import { AxiosResponse } from 'axios';

import { Axios } from './webRequest';

export const getNotesListService = (params: {
  [key: string]: any;
}): Promise<AxiosResponse<any, any>> => {
  return Axios.get('/notes', { params });
};
