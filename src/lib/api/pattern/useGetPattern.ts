import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useState } from 'react';

export const useGetPattern = () => {
  const [data, setData] = useState<any>(undefined);

  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((s: Store) => s.auth);

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (patternId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getPatternById(patternId, {
          ...(await getApi(accessToken, refreshToken, dispatch)),
        }),
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
