import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostTestingRequest, PostTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateTesting = () => {
  const [data, setData] = useState<PostTestingResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testing: PostTestingRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postTesting(testing, {
          ...(await getApi(session)),
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
