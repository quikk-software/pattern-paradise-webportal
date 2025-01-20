import { Api } from './api-types';

const client = new Api({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  baseApiParams: {
    mode: 'cors',
  },
});

const getApi = async (accessToken?: string) => {
  const headers: Record<any, any> = {};
  headers.Authorization = !!accessToken ? `Bearer ${accessToken}` : undefined;
  return { headers };
};

export { client, getApi };
