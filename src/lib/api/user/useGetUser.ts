import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useGetUser = () => {
  const [data, setData] = useState<GetUserResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken, userId } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async () => {
    const response = await handleFn(
      async () =>
        await client.api.getUser(userId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );

    setData(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
