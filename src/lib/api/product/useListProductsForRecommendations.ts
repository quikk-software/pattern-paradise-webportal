import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useListProductsForRecommendations = () => {
  const [data, setData] = useState<GetProductResponse[]>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async () => {
    const response = await handleFn(
      async () =>
        await client.api.listProductsForRecommendations({
          ...(await getApi(session)),
        }),
    );

    setData(response?.data.products ?? []);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
