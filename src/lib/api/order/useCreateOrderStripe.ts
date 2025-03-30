import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostOrderRequest, PostOrderStripeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateOrderStripe = () => {
  const [data, setData] = useState<PostOrderStripeResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (order: PostOrderRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postOrderStripe(order, {
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
