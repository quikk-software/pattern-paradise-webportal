import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { PostOnboardStripeResponse } from '@/@types/api-types';

export const useOnboardStripe = () => {
  const [data, setData] = useState<PostOnboardStripeResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.onboardStripeUser(userId, {
          ...(await getApi(session)),
        }),
    );

    setData(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
