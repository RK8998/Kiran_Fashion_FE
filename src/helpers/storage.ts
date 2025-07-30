// helpers/storage.ts
export const AUTH_TOKEN = 'AUTH_TOKEN';

export const localStorageHandler = (
  action: 'GET' | 'SET' | 'REMOVE',
  key: string,
  value?: string
): string | void => {
  switch (action) {
    case 'GET':
      return localStorage.getItem(key) || '';

    case 'SET':
      if (value) localStorage.setItem(key, value);

      return;

    case 'REMOVE':
      localStorage.removeItem(key);

      return;
  }
};
