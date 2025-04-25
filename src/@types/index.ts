import { Api } from './api-types';
import { getAccessToken } from '@/lib/auth/auth.utils';
import { Session } from 'next-auth';

const client = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  baseApiParams: {
    mode: 'cors',
  },
});

const getBearerToken = (accessToken?: string) => {
  const headers: Record<any, any> = {};
  headers.Authorization = !!accessToken ? `Bearer ${accessToken}` : undefined;
  return { headers };
};

const getApi = async (session: Session | null) => {
  const accessToken = await getAccessToken(session);
  return getBearerToken(accessToken);
};

export { client, getApi, getBearerToken };
