/**
 * @file helpers/toastMessage.js
 * @author Krushang Rathod / (krushang.r@crestinfosystems.net)
 * @description This is for create reusable toast message function
 *
 */

import { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Display a success toast message.
 *
 * This function shows a success toast message with the given message.
 * If no message is provided, it defaults to "Success!".
 *
 * @param {string} [message="Success!"] - The message to display in the success toast.
 */
export const displaySuccessToast = (message = 'Success!') => {
  toast.success(message);
};

export const AppToast = (promise: Promise<AxiosResponse>, loadingMessage = 'In Process') => {
  toast.promise(promise, {
    loading: loadingMessage + '....',
  });
};

/**
 * Display an error toast message.
 *
 * This function shows an error toast message with the given message.
 * If no message is provided, it defaults to "Something went wrong.".
 *
 * @param {string} [message="Something went wrong."] - The message to display in the error toast.
 */
export const displayErrorToast = (message = 'Something went wrong.') => {
  toast.error(message);
};

/**
 * Display an warning toast message.
 *
 * This function shows an warning toast message with the given message.
 * If no message is provided, it defaults to "Warning: Please check and try again.".
 *
 * @param {string} [message="Warning: Please check and try again."] - The message to display in the warning toast.
 */
// export const displayWarningToast = (message = 'Warning: Please check and try again.') => {
//   toast.(message);
// };

/**
 * Display an info toast message.
 *
 * This function shows an info toast message with the given message.
 * If no message is provided, it defaults to "Info: Here’s what you need to know.".
 *
 * @param {string} [message="Info: Here’s what you need to know."] - The message to display in the information toast.
 */
// export const displayInfoToast = (message = 'Info: Here’s what you need to know.') => {
//   toast(message, { type: 'info' });
// };
