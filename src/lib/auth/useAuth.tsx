'use client';

import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import Cookie from 'js-cookie';
import { getUserIdFromAccessToken, isTokenValid, saveTokensToCookies } from '@/lib/auth/auth.utils';
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
import { useEffect, useState } from 'react';
import { useGetUser } from '@/lib/api';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const { redirectUrl } = useRedirect();
  const { push } = useRouter();

  const { fetch } = useGetUser();

  const { accessToken: accessTokenFromStore, username } = useSelector((store: Store) => store.auth);

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
        `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: 'password',
          client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
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

        await saveTokensToCookies(accessToken, refreshToken);

        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));

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
    const accessToken = accessTokenFromStore
      ? accessTokenFromStore
      : Cookie.get('accessToken') ?? null;

    const isValid = isTokenValid(accessToken);
    setIsLoggedIn(isValid);

    if (isValid && accessToken !== null) {
      const fetchAndSetUserData = async () => {
        const userId = getUserIdFromAccessToken(accessToken);
        const user = await fetch(userId);
        if (!user) {
          return;
        }
        dispatch(setUserId(user.id));
        dispatch(setRoles(user.roles ?? []));
      };
      fetchAndSetUserData();
    }
  }, [accessTokenFromStore]);

  return {
    handleLogin,
    handleLogout,
    isLoggedIn,
    isLoading,
    isSuccess,
    isError,
    username,
  };
};

export default useAuth;
