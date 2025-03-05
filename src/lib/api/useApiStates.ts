import { useState } from 'react';
import logger from '@/lib/core/logger';

export const useApiStates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFn = async <T>(fn: () => Promise<T>, ignoreIsLoading = false) => {
    if (!ignoreIsLoading) {
      setIsLoading(true);
    }
    setIsCalled((ic) => !ic);
    try {
      setUploadProgress(0);
      const result = await fn();
      setIsSuccess(true);
      setIsError(false);
      return result;
    } catch (err: any) {
      setIsSuccess(false);
      setIsError(true);
      const errorPayload = await err
        .json()
        .catch(() => logger.error("Couldn't load error response"));
      logger.error(errorPayload);
      if (
        errorPayload?.status !== undefined &&
        errorPayload?.status !== '' &&
        errorPayload?.detail !== '' &&
        errorPayload?.detail !== undefined
      ) {
        setValidationErrors(errorPayload?.errors ?? []);
        setErrorDetail(errorPayload?.detail);
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
    isCalled,
    setIsCalled,
    handleFn,
  };
};
