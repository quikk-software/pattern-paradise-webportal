import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useState } from 'react';
import { useCookies } from 'next-client-cookies';

export const useDownloadPatternsByProductId = () => {
  const [data, setData] = useState<any>(undefined);

  const cookieStore = useCookies();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

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
            ...(await getApi(accessToken, refreshToken, dispatch, cookieStore)),
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
