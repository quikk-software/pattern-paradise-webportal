import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import { PostCaptureOrderResponse } from '@/@types/api-types';
import { useSession } from 'next-auth/react';

export const useCaptureOrder = () => {
  const [data, setData] = useState<PostCaptureOrderResponse | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (paypalOrderId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.captureOrder(paypalOrderId, {
          ...(await getApi(session?.user.accessToken)),
        }),
    );

    const orderId = response.data?.orderId;

    setData(response.data);

    return orderId;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
