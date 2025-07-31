import { AxiosError } from 'axios';
import moment from 'moment';

import { displayErrorToast } from './toast';

interface MutationError {
  error: AxiosError<any>;
}

export function mutationOnErrorHandler({ error }: MutationError) {
  // Retrieve error message from the error response, using fallback to a general error message
  const errorMessage = error?.response?.data?.message || error.message;

  // Display the error message if it's a string
  if (errorMessage && typeof errorMessage === 'string') {
    displayErrorToast(errorMessage);
  }
  // If the error message is an object, extract the first value in it to display
  else if (typeof errorMessage === 'object') {
    const err = Object.values(errorMessage);
    const message = err[0][0] || 'Something went wrong.';

    // Display the extracted message if it's a string
    if (message && typeof message === 'string') {
      displayErrorToast(message);
    }
  }
}

export const getFormattedDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY');
};
