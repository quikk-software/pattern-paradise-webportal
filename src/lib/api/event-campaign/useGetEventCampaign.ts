import { client, getApi } from '@/@types';
import { useApiStates } from '../useApiStates';
import { useValidSession } from '@/hooks/useValidSession';
import { useState } from 'react';
import { GetEventCampaignResponse } from '@/@types/api-types';

export const useGetEventCampaign = () => {
  const [data, setDate] = useState<GetEventCampaignResponse | undefined>(undefined);

  const { data: session } = useValidSession();

  const { handleFn, ...apiStates } = useApiStates();

  const fetch = async (eventCampaignId: string) => {
    const response = await handleFn(
      async () =>
        await client.api.getEventCampaign(eventCampaignId, {
          ...(await getApi(session)),
        }),
    );

    setDate(response.data);

    return response.data;
  };

  return {
    ...apiStates,
    fetch,
    data,
    setDate,
  };
};
