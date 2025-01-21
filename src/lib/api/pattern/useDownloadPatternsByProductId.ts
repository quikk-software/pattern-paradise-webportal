import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const useDownloadPatternsByProductId = () => {
  const [data, setData] = useState<any>(undefined);

  const { data: session, update } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (productId: string, language?: string) => {
    const response = await handleFn(
      async () =>
        await client.api.downloadPatterns(
          productId,
          {
            language,
          },
          {
            ...(await getApi(session, update)),
          },
        ),
    );

    const file = await response.blob();

    setData(file);

    return file;
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
