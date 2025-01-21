import { Api } from './api-types';
import { getAccessToken } from '@/lib/auth/auth.utils';
import { Session } from 'next-auth';

const client = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  baseApiParams: {
    mode: 'cors',
  },
});

const getApi = async (session: Session | null) => {
  const accessToken = await getAccessToken(session);

  const headers: Record<any, any> = {};
  headers.Authorization = !!accessToken ? `Bearer ${accessToken}` : undefined;
  return { headers };
};

export { client, getApi };
