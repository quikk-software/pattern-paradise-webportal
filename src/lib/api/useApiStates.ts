import { useState } from 'react';
import logger from '@/lib/core/logger';
import { signOut } from 'next-auth/react';
import { useValidSession } from '@/hooks/useValidSession';

export const useApiStates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const { update } = useValidSession();

  const refreshToken = async (): Promise<boolean> => {
    try {
      const updatedSession = await update();
      logger.info('Token refreshed:', updatedSession);
      return !!updatedSession;
    } catch (err) {
      logger.error('Token refresh failed', err);
      return false;
    }
  };

  const parseError = async (
    err: any,
  ): Promise<{
    status?: number;
    detail?: string;
    errors?: string[];
  }> => {
    try {
      // Axios-style error
      if (err?.response?.data) {
        return {
          status: err.response.data.status,
          detail: err.response.data.detail,
          errors: err.response.data.errors ?? [],
        };
      }

      // Fetch-style response with .json method
      if (typeof err?.json === 'function') {
        return await err.json();
      }
    } catch (parseError) {
      logger.warn('Failed to parse error response', parseError);
    }

    return {};
  };

  const handleFn = async <T>(
    fn: () => Promise<T>,
    ignoreIsLoading = false,
    retrying = false,
  ): Promise<T> => {
    if (!ignoreIsLoading) {
      setIsLoading(true);
    }
    setIsCalled((prev) => !prev);
    setUploadProgress(0);
    setDownloadProgress(0);
    setValidationErrors([]);
    setErrorDetail(undefined);
    setIsError(false);
    setIsSuccess(false);

    try {
      const result = await fn();
      setIsSuccess(true);
      return result;
    } catch (err: any) {
      const parsedError = await parseError(err);

      logger.error('API call failed', parsedError);

      if (parsedError?.detail) {
        setErrorDetail(parsedError.detail);
      }
      if (parsedError?.errors?.length) {
        setValidationErrors(parsedError.errors);
      }
      setIsError(true);

      // Handle 401 Unauthorized
      if (parsedError.status === 401 && !retrying) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return await handleFn(fn, ignoreIsLoading, true); // Retry once
        }

        await signOut({ callbackUrl: '/auth/login' });
      }

      throw err;
    } finally {
      if (!ignoreIsLoading) {
        setIsLoading(false);
      }
    }
  };

  return {
    isLoading,
    setIsLoading,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
    errorDetail,
    setErrorDetail,
    validationErrors,
    setValidationErrors,
    uploadProgress,
    setUploadProgress,
    downloadProgress,
    setDownloadProgress,
    isCalled,
    setIsCalled,
    handleFn,
  };
};
