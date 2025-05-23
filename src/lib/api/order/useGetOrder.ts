import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetOrder = () => {
  const [data, setData] = useState<GetOrderResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (orderId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getOrderById(orderId, {
          ...(await getApi(session)),
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
