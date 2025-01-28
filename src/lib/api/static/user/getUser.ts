import { client, getBearerToken } from '@/@types';
import logger from '@/lib/core/logger';

export const getUser = async (userId: string, accessToken: string) => {
  try {
    const response = await client.api.getUser(userId, {
      ...getBearerToken(accessToken),
    });

    return response.data;
  } catch (error) {
    logger.error(error);
  }
};
