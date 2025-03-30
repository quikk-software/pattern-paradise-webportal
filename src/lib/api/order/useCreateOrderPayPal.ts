import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostOrderRequest, PostOrderPayPalResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreateOrderPayPal = () => {
  const [data, setData] = useState<PostOrderPayPalResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (order: PostOrderRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postOrderPayPal(order, {
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
