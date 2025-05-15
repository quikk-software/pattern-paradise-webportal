import { getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import axios from 'axios';

export const useDownloadPatternsByProductId = () => {
  const [data, setData] = useState<any>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, setDownloadProgress, ...apiStates } = useApiStates();

  const fetch = async (productId: string, language: string) => {
    const response = await handleFn(async () => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/patterns/products/${productId}/download?language=${language}`,
        {
          ...(await getApi(session)),
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setDownloadProgress(percentCompleted);
            }
          },
        },
      );
    });

    const file = response.data;

    setData(file);

    return file;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
