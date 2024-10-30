import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useState } from 'react';
import type { GetTestingResponse } from '@/@types/api-types';

export const useGetTesting = () => {
  const [data, setData] = useState<GetTestingResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getTestingById(testingId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
