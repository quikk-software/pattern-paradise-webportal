import { useState } from 'react';
import logger from '@/lib/core/logger';
import { usePathname } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useValidSession } from '@/hooks/useValidSession';

export const useApiStates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCalled, setIsCalled] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const pathname = usePathname();
  const { update } = useValidSession();

  const refreshToken = async () => {
    try {
      const updatedSession = await update(); // Attempts to refresh token
      logger.info('Token refreshed:', updatedSession);
      return !!updatedSession;
    } catch (err) {
      logger.error('Token refresh failed', err);
      return false;
    }
  };

  const handleFn = async <T>(
    fn: () => Promise<T>,
    ignoreIsLoading = false,
    retrying = false,
  ): Promise<T> => {
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
        .json?.()
        .catch(() => logger.error("Couldn't load error response"));

      logger.error(errorPayload);

      if (errorPayload?.status && errorPayload?.detail !== undefined) {
        setValidationErrors(errorPayload?.errors ?? []);
        setErrorDetail(errorPayload?.detail);
      }

      if (errorPayload?.status === 401) {
        if (!retrying) {
          const refreshed = await refreshToken();
          if (refreshed) {
            return await handleFn(fn, ignoreIsLoading, true);
          }
        }
        await signIn(undefined, {
          callbackUrl: `/auth/login?redirect=${encodeURIComponent(pathname)}`,
        });
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
