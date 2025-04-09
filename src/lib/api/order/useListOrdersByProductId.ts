import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useListOrdersByProductId = () => {
  const [data, setData] = useState<GetOrderResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listOrdersByProductId(
          productId,
          {},
          {
            ...(await getApi(session)),
          },
        ),
    );

    setData(response?.data.orders);

    return response?.data.orders;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
