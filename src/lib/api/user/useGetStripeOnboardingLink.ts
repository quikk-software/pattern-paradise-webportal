import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { GetStripeOnboardingLinkResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';

export const useGetStripeOnboardingLink = () => {
  const [data, setData] = useState<GetStripeOnboardingLinkResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (userId: string) => {
    if (!userId) return;
    const response = await handleFn(
      async () =>
        await client.api.getStripeOnboardingLink(userId, {
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
