import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostMysteryOrderRequest, PostOrderPayPalResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateMysteryOrderPayPal = () => {
  const [data, setData] = useState<PostOrderPayPalResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (order: PostMysteryOrderRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postMysteryOrderPayPal(order, {
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
