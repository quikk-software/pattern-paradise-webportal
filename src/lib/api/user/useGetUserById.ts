import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserAccountResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useGetUserById = () => {
  const [data, setData] = useState<GetUserAccountResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getUserById(userId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );

    const data = await response.json();

    setData(data);

    return data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
