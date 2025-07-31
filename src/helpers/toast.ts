/**
 * @file helpers/toastMessage.js
 * @author Krushang Rathod / (krushang.r@crestinfosystems.net)
 * @description This is for create reusable toast message function
 *
 */

import { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

export const AppToast = (promise: Promise<AxiosResponse>, loadingMessage = 'In Process') => {
  toast.promise(promise, {
    loading: loadingMessage + '....',
  });
};

export const displaySuccessToast = (message = 'Success!') => {
  toast.success(message);
};

export const displayErrorToast = (message = 'Something went wrong.') => {
  toast.error(message);
};
