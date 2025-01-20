import { useState } from 'react';
import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useGetProductReportsCount = () => {
  const [data, setData] = useState<number | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductReportsCount(userId, {
          ...(await getApi(session?.user.accessToken)),
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
