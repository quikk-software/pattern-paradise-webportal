import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { GetProductLikeResponse } from '@/@types/api-types';

export const useGetProductLike = () => {
  const [data, setDate] = useState<GetProductLikeResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getProductLikeByProductId(productId, {
          ...(await getApi(session)),
        }),
    );

    setDate(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
    setDate,
  };
};
