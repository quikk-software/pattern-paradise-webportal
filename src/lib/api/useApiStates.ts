import { useState } from 'react';
import logger from '@/lib/core/logger';

// List of routes where an error shouldn't be displayed
const BLACKLISTED_ROUTES: string[] = [];

export const useApiStates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFn = async <T>(fn: () => Promise<T>, ignoreIsLoading = false) => {
    if (!ignoreIsLoading) {
      setIsLoading(true);
    }
    setIsCalled((ic) => !ic);
    try {
      const result = await fn();
      setIsSuccess(true);
      setIsError(false);
      return result;
    } catch (err: any) {
      setIsSuccess(false);
      setIsError(true);
      logger.error(err.message);
      if (
        err?.error?.status !== undefined &&
        err?.error?.status !== '' &&
        err?.error?.detail !== '' &&
        err?.error?.detail !== undefined
      ) {
        setValidationErrors(err?.error?.errors ?? []);
        setErrorDetail(err?.error?.detail);
        if (!BLACKLISTED_ROUTES.some((route) => err?.url.includes(route))) {
          // Don't show error dialogs for now due to possible overlapping dialogs
          // dispatch(setErrorValidationErrors(err?.error?.errors ?? []));
          // dispatch(setErrorText(err?.error?.detail));
          // dispatch(setErrorCode(err?.error?.status));
          // if (err?.error?.status >= 500) {
          //   dispatch(setErrorSeverity('severe'));
          // } else {
          //   dispatch(setErrorSeverity('moderate'));
          // }
          // dispatch(setErrorIsVisible(true));
        }
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
    isCalled,
    setIsCalled,
    handleFn,
  };
};
