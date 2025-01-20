import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import type { GetTestingResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';

export const useGetTesting = () => {
  const [data, setData] = useState<GetTestingResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (testingId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getTestingById(testingId, {
          ...(await getApi(session?.user.accessToken)),
        }),
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
