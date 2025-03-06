import { getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export const useUpdateProduct = () => {
  const { data: session } = useSession();

  const { handleFn, setUploadProgress, ...apiStates } = useApiStates();

  const mutate = async (productId: string, product: FormData) => {
    await handleFn(async () => {
      return await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`,
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
  };

  return {
    ...apiStates,
    setUploadProgress,
    mutate,
  };
};
