import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetProduct = () => {
  const [data, setData] = useState<GetProductResponse | undefined>(undefined);

  const { handleFn, ...apiStates } = useApiStates();

  const { data: session } = useSession();

  const fetch = async (productId: string, trackMetrics: boolean = true) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductById(
          productId,
          { trackMetrics },
          {
            ...(await getApi(session?.user.accessToken)),
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
