import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import type { GetTestingResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';

export const useGetTestingByProductId = () => {
  const [data, setData] = useState<GetTestingResponse | undefined>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string, trackMetrics: boolean = true) => {
    const response = await handleFn(
      async () =>
        await client.api.getTestingByProductId(
          productId,
          {
            trackMetrics,
          },
          {
            ...(await getApi(session, update)),
          },
        ),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
