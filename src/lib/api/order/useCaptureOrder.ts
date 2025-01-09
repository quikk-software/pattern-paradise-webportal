import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useState } from 'react';
import { PostCaptureOrderResponse } from '@/@types/api-types';
import { useCookies } from 'next-client-cookies';

export const useCaptureOrder = () => {
  const [data, setData] = useState<PostCaptureOrderResponse | undefined>(undefined);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (paypalOrderId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.captureOrder(paypalOrderId, {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
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
