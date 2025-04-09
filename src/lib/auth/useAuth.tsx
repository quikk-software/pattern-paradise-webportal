'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import logger from '@/lib/core/logger';
import useRedirect from '@/lib/core/useRedirect';
import { Store } from '@/lib/redux/store';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { handleLogoutFlow } from '@/lib/auth/auth.utils';
import { useValidSession } from '@/hooks/useValidSession';

const useAuth = () => {
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [loginIsSuccess, setLoginIsSuccess] = useState(false);
  const [loginIsError, setLoginIsError] = useState(false);
  const [logoutIsLoading, setLogoutIsLoading] = useState(false);
  const [logoutIsSuccess, setLogoutIsSuccess] = useState(false);
  const [logoutIsError, setLogoutIsError] = useState(false);

  const { redirectUrl } = useRedirect();

  const router = useRouter();
  const { data: session } = useValidSession();

  const { username } = useSelector((store: Store) => store.auth);

  const handleLogin = async (username: string, password: string) => {
    if (username === '' || password === '') {
      logger.warn('Username or password are empty.', { username, password });
      return;
    }

    setLoginIsLoading(true);
    setLoginIsSuccess(false);
    setLoginIsError(false);

    try {
      const result = await signIn('credentials', {
        username: username,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        logger.error(`Login failed: ${result.error}`);
        setLoginIsError(true);
      } else {
        setLoginIsSuccess(true);
        router.push(redirectUrl);
      }
    } catch (err) {
      logger.error(err);
      setLoginIsError(true);
    } finally {
      setLoginIsLoading(false);
    }
  };

  const handleLogout = () => {
    const refreshToken = session?.user?.refreshToken;
    if (refreshToken) {
      setLogoutIsLoading(true);
      handleLogoutFlow(refreshToken)
        .then(() => {
          setLogoutIsError(false);
          setLogoutIsSuccess(true);
        })
        .catch(() => {
          setLogoutIsSuccess(false);
          setLogoutIsError(true);
        })
        .finally(() => setLogoutIsLoading(false));
    }
  };

  return {
    handleLogin,
    handleLogout,
    loginStates: {
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
      isError: loginIsError,
    },
    logoutStates: {
      isLoading: logoutIsLoading,
      isSuccess: logoutIsSuccess,
      isError: logoutIsError,
    },
    username,
  };
};

export default useAuth;
