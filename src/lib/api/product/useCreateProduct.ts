import { useState } from 'react';
import axios from 'axios';
import type { PostProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { getApi } from '@/@types';
import { useCookies } from 'next-client-cookies';

export const useCreateProduct = () => {
  const [data, setData] = useState<PostProductResponse | undefined>(undefined);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const mutate = async (product: FormData) => {
    const response = await handleFn(async () => {
      return await axios.post<PostProductResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
        product,
        {
          ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
        },
      );
    });

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    mutate,
    data,
  };
};
