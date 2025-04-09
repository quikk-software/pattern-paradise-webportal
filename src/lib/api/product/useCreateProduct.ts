import { useState } from 'react';
import axios from 'axios';
import type { PostProductResponse } from '@/@types/api-types';
import { useApiStates } from '../useApiStates';
import { getApi } from '@/@types';
import { useValidSession } from '@/hooks/useValidSession';

export const useCreateProduct = () => {
  const [data, setData] = useState<PostProductResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, setUploadProgress, ...apiStates } = useApiStates();

  const mutate = async (product: FormData) => {
    const response = await handleFn(async () => {
      return await axios.post<PostProductResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
        product,
        {
          ...(await getApi(session)),
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            }
          },
        },
      );
    });

    setData(response?.data);

    return response?.data;
  };

  return {
    ...apiStates,
    setUploadProgress,
    mutate,
    data,
  };
};
