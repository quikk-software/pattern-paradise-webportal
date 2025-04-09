import { useState } from 'react';
import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetProductReportsCount = () => {
  const [data, setData] = useState<number | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductReportsCount(userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response.data?.openIncidentsCount);

    return response.data?.openIncidentsCount;
  };

  return {
    ...apiStates,
    data,
    fetch,
  };
};
