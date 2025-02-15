import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const useDownloadPattern = () => {
  const [data, setData] = useState<{ file: Blob; objectName: string } | undefined>(undefined);

  const { data: session } = useSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (patternId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.downloadPattern(patternId, {
          ...(await getApi(session)),
        }),
    );

    const disposition = response.headers.get('Content-Disposition');
    const objectName = disposition
      ? disposition.split('filename=')[1].replace(/"/g, '')
      : 'default-filename';

    const file = await response.blob();

    setData({ file, objectName });

    return { file, objectName };
  };

  return {
    ...apiStates,
    fetch,
    data,
  };
};
