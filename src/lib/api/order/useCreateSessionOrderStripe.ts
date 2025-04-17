import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostOrderRequest, PostSessionOrderStripeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateSessionOrderStripe = () => {
  const [data, setData] = useState<PostSessionOrderStripeResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (order: PostOrderRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postOrderStripeSession(order, {
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
