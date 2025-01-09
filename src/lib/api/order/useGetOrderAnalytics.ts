import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCookies } from 'next-client-cookies';

export const useGetOrderAnalytics = () => {
  const [data, setData] = useState<GetOrderAnalyticsResponse | undefined>(undefined);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getOrderAnalytics(userId, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
