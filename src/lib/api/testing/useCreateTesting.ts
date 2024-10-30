import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostTestingRequest, PostTestingResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateTesting = () => {
  const [data, setData] = useState<PostTestingResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (testing: PostTestingRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postTesting(testing, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
    );

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
