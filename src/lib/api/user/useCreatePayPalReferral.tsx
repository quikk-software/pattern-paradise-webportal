import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostUserPayPalReferralResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreatePayPalReferral = () => {
  const [data, setData] = useState<PostUserPayPalReferralResponse | undefined>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.postUserPayPalReferral(userId, {
          ...(await getApi(session, update)),
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
