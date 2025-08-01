import { Axios } from './webRequest';

import { NotesFormTypes } from '@/constants/formTypes';

export const getNotesListService = (params: { [key: string]: any }) => {
  return Axios.get('/notes', { params });
};

export const getNoteByIdService = (id: string, params: { [key: string]: any }) => {
  return Axios.get(`/notes/${id}`, { params });
};

export const createNotesService = (data: NotesFormTypes) => {
  return Axios.post('/notes', data);
};

export const deleteNotesService = (id: string | null) => {
  return Axios.delete(`/notes/${id}`);
};

export const updateNotesService = (id: string, data: NotesFormTypes) => {
  return Axios.put(`/notes/${id}`, data);
};
