import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderAnalyticsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetOrderAnalytics = () => {
  const [data, setData] = useState<GetOrderAnalyticsResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string, startDate?: Date, endDate?: Date) => {
    const response = await handleFn(
      async () =>
        await client.api.getOrderAnalytics(
          userId,
          {
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
          },
          {
            ...(await getApi(session)),
          },
        ),
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
