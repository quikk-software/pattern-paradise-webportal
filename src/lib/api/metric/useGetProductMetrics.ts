import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductMetricsResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetProductMetrics = () => {
  const [data, setData] = useState<GetProductMetricsResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductMetrics(productId, {
          ...(await getApi(session?.user.accessToken)),
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
