import { GetUserAccountResponse } from '@/@types/api-types';

export const buildUserName = (user?: GetUserAccountResponse) => {
  return user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName
    ? user.firstName
    : user?.lastName
    ? user.lastName
    : user?.username ?? undefined;
};
