import { client, getBearerToken } from '@/@types';
import logger from '@/lib/core/logger';

export const getUserById = async (userId: string) => {
  try {
    const response = await client.api.getUserById(
      userId,
      {},
      {
        next: { revalidate: 60 * 60 }, // 1 hour
      },
    );

    return response.data;
  } catch (error) {
    logger.error(error);
  }
};
