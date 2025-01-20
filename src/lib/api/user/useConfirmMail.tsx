import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { VerifyCodeRequest, VerifyCodeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';

export const useConfirmMail = () => {
  const [data, setData] = useState<VerifyCodeResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: VerifyCodeRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.confirmMail(data, {
          ...(await getApi(session?.user.accessToken)),
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
