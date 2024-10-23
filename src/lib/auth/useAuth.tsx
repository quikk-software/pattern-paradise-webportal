import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getUserIdFromAccessToken, isTokenValid } from '@/lib/auth/auth.utils';
import {
  initialState,
  reset,
  setAccessToken,
  setRefreshToken,
  setRoles,
  setUserId,
  setUsername,
} from '@/lib/features/auth/authSlice';
import logger from '@/lib/core/logger';
import useRedirect from '@/lib/core/useRedirect';
import { useRouter } from 'next/navigation';
import { Store } from '@/lib/redux/store';

const useAuth = () => {
  const dispatch = useDispatch();
  const { redirectUrl } = useRedirect();
  const { push } = useRouter();

  const { accessToken, username, userId } = useSelector((store: Store) => store.auth);

  const getUserData = useCallback(
    async () => {
      if (userId === initialState.userId) {
        return undefined;
      }

      // TODO: Sobald die API Route steht: Tatsächlichen Namen fetchen

      // const res = await axios.get(getUserDataURL(userId), {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
      //
      // // TODO: Add profile picture, etc...
      //
      // const {
      //   data,
      // }: {
      //   data: {
      //     username: string;
      //   };
      // } = res;

      const username = '';

      dispatch(setUsername(username));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken],
  );

  const setUserDataInReduxStore = (accessToken: string) => {
    const decodedToken = jwtDecode(accessToken);
    const userId = getUserIdFromAccessToken(accessToken);
    dispatch(setUserId(userId));
    dispatch(setRoles((decodedToken as any)?.resource_access?.ava?.roles ?? []));
  };

  const handleLogin = async (username: string, password: string) => {
    if (username === '' || password === '') {
      logger.warn('Username or password are empty.', { username, password });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL}/realms/cbj/protocol/openid-connect/token`,
        qs.stringify({
          grant_type: 'password',
          client_id: 'cbj',
          username: username,
          password: password,
          scope: 'openid',
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

        console.log({ redirectUrl });
        push(redirectUrl);
      }
    } catch (err) {
      logger.error(err);
      // Error Snackbar o.ä. hier dispatchen?
      // displaySuccess("Anmeldung fehlgeschlagen");
    }
  };

  const handleLogout = async () => {
    dispatch(reset());
    push('/auth/login');
  };

  const isLoggedIn = () => {
    return isTokenValid(accessToken);
  };

  return {
    getUserData,
    handleLogin,
    handleLogout,
    isLoggedIn: isLoggedIn(),
    username,
    setUserDataInReduxStore,
  };
};

export default useAuth;
