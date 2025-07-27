import { AxiosError } from "axios";

export const handleRetry = (failureCount: number, error: Error) => {
  // Do not retry for 403 errors
  if ((error as AxiosError).response?.status === 403) {
    return false;
  }
  // Retry up to 3 times for other errors
  return failureCount < 3;
};
