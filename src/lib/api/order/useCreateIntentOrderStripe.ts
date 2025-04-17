import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostOrderRequest, PostIntentOrderStripeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateIntentOrderStripe = () => {
  const [data, setData] = useState<PostIntentOrderStripeResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (order: PostOrderRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postOrderStripeIntent(order, {
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
