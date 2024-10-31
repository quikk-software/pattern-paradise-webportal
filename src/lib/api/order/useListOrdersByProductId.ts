import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetOrderResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useListOrdersByProductId = () => {
  const [data, setData] = useState<GetOrderResponse[]>([]);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.listOrdersByProductId(productId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
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
