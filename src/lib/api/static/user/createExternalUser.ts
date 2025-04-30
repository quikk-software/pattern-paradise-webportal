import { client } from '@/@types';
import logger from '@/lib/core/logger';
import { PostExternalUserRequest } from '@/@types/api-types';

export const createExternalUser = async (data: PostExternalUserRequest) => {
  try {
    const response = await client.api.postExternalUser(data);

    return response.data;
  } catch (error) {
    logger.error(error);
  }
};
