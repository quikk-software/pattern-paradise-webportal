import { useState } from 'react';
import { client, getApi } from '@/@types';
import type {
  PostUserPayPalReferralRequest,
  PostUserPayPalReferralResponse,
} from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useCreatePayPalReferral = () => {
  const [data, setData] = useState<PostUserPayPalReferralResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (userId: string, data: PostUserPayPalReferralRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postUserPayPalReferral(userId, data, {
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
