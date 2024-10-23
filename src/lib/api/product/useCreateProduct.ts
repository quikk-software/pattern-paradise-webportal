import { useState } from 'react';
import { client, getApi } from '@/@types';
import type { PostProductRequest, PostProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

export const useCreateProduct = () => {
  const [data, setData] = useState<PostProductResponse | undefined>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (product: PostProductRequest) => {
    const response = await handleFn(
      async () =>
        await client.api.postProduct(product, {
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
