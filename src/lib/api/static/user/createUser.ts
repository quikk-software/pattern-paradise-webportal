import { client } from '@/@types';
import logger from '@/lib/core/logger';
import { PostUserRequest } from '@/@types/api-types';

export const createUser = async (data: PostUserRequest) => {
  try {
    const response = await client.api.postUser(data);

    return response.data;
  } catch (error) {
    logger.error(error);
  }
};
