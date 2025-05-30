import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetPatternFilesResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetPatternsByProductId = () => {
  const [data, setData] = useState<GetPatternFilesResponse>([]);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getPatternsByProductId(productId, {
          ...(await getApi(session)),
        }),
    );

    setData(response.data);

    return response?.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
