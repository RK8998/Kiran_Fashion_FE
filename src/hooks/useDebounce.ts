import { useEffect, useState } from 'react';

/**
 * Custom React hook to debounce a value.
 *
 * This hook takes a value and a delay as inputs and returns a debounced version of the value.
 * The returned value only updates after the specified delay has passed without further changes to the input value.
 * This is useful to limit the rate at which a function is executed, such as API calls triggered by user input.
 *
 * @param {any} value - The value to debounce. It can be of any type.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {any} The debounced value.
 */
export default function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
