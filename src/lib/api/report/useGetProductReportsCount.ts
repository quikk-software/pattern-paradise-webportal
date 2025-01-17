import { useState } from 'react';
import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useGetProductReportsCount = () => {
  const [data, setData] = useState<number | undefined>(undefined);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductReportsCount(userId, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        }),
    );

    setData(response.data?.openIncidentsCount);

    return response.data?.openIncidentsCount;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
