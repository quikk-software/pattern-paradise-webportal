import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import axios from 'axios';

export const useDownloadPattern = () => {
  const [data, setData] = useState<{ file: Blob; objectName: string } | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, setDownloadProgress, ...apiStates } = useApiStates();

  const fetch = async (patternId: string) => {
    const response = await handleFn(async () => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/patterns/${patternId}/download`,
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

    const disposition = response?.headers?.['content-disposition'] || '';
    const objectName = disposition ? disposition.split('filename=')[1].replace(/"/g, '') : 'error';

    const file = response.data;

    setData({ file, objectName });

    return { file, objectName };
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
