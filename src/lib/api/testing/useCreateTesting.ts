import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostTestingRequest, PostTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateTesting = () => {
  const [data, setData] = useState<PostTestingResponse | undefined>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testing: PostTestingRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postTesting(testing, {
          ...(await getApi(session, update)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
