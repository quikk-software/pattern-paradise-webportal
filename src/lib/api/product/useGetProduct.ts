import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useGetProduct = () => {
  const [data, setData] = useState<GetProductResponse | undefined>(undefined);

  const { handleFn, ...apiStates } = useApiStates();

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const fetch = async (productId: string, trackMetrics: boolean = true) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductById(
          productId,
          { trackMetrics },
          {
            ...(await getApi(accessToken, refreshToken, dispatch)),
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
