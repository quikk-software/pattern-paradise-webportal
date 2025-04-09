import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetUserPayPalMerchantStatusResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetPayPalMerchantStatus = () => {
  const [data, setData] = useState<GetUserPayPalMerchantStatusResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    if (!userId) return;
    const response = await handleFn(
      async () =>
        await client.api.getPayPalMerchantStatus(userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
