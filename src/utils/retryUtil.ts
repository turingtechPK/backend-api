import axios, { AxiosResponse } from 'axios';

interface RetryConfig {
  retries: number;
  delay: number; // delay between retries in milliseconds
  maxTimeout: number; // maximum timeout for the entire operation in milliseconds
}

export const retryRequest = async <T>(
  fn: () => Promise<AxiosResponse<T>>,
  { retries, delay, maxTimeout }: RetryConfig
): Promise<AxiosResponse<T>> => {
  const start = Date.now();
  let lastError: any;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fn();
      return response;
    } catch (error) {
      lastError = error;
      const elapsed = Date.now() - start;
      if (elapsed + delay > maxTimeout) {
        break; // If the next retry would exceed maxTimeout, break out
      }
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
    }
  }

  throw lastError; // If all retries fail, throw the last error encountered
};
