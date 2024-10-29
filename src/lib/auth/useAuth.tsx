'use client';

import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getUserIdFromAccessToken, isTokenValid } from '@/lib/auth/auth.utils';
import {
  reset,
  setAccessToken,
  setRefreshToken,
  setRoles,
  setUserId,
} from '@/lib/features/auth/authSlice';
import logger from '@/lib/core/logger';
import useRedirect from '@/lib/core/useRedirect';
import { useRouter } from 'next/navigation';
import { Store } from '@/lib/redux/store';
import { getLocalStorageItem, LocalStorageKey } from '@/lib/core/localStorage.utils';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const { redirectUrl } = useRedirect();
  const { push } = useRouter();

  const { accessToken: accessTokenFromStore, username } = useSelector((store: Store) => store.auth);

  const setUserDataInReduxStore = (accessToken: string) => {
    const decodedToken = jwtDecode(accessToken);
    const userId = getUserIdFromAccessToken(accessToken);
    dispatch(setUserId(userId));
    dispatch(setRoles((decodedToken as any)?.resource_access?.cbj?.roles ?? []));
  };

  const handleLogin = async (username: string, password: string) => {
    if (username === '' || password === '') {
      logger.warn('Username or password are empty.', { username, password });
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/cbj/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: 'password',
          client_id: 'cbj',
          username: username,
          password: password,
          scope: 'openid profile',
        }),
      );
      if (response.status === 200) {
        // Success Snackbar o.ä. hier dispatchen?
        // displaySuccess("Anmeldung erfolgreich");
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        setUserDataInReduxStore(accessToken);

        setIsSuccess(true);

        push(redirectUrl);
      }
    } catch (err) {
      logger.error(err);
      setIsError(true);
      // Error Snackbar o.ä. hier dispatchen?
      // displaySuccess("Anmeldung fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(reset());
    push('/auth/login');
  };

  useEffect(() => {
    const accessToken =
      accessTokenFromStore ?? getLocalStorageItem(LocalStorageKey.accessToken, null);
    setIsLoggedIn(isTokenValid(accessToken));
  }, [accessTokenFromStore]);

  return {
    handleLogin,
    handleLogout,
    isLoggedIn,
    isLoading,
    isSuccess,
    isError,
    username,
    setUserDataInReduxStore,
  };
};

export default useAuth;
