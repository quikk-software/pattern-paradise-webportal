import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { VerifyCodeRequest, VerifyCodeResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useConfirmPayPalMail = () => {
  const [data, setData] = useState<VerifyCodeResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (data: VerifyCodeRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.confirmPayPalMail(data, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
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
