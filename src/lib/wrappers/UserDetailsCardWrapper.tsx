import React from 'react';
import UserDetailsCardLight from '@/lib/components/UserDetailsCardLight';
import UserDetailsCard from '@/lib/components/UserDetailsCard';
import { GetUserAccountResponse } from '@/@types/api-types';

interface UserDetailsCardWrapperProps {
  user: GetUserAccountResponse;
  showFlag?: boolean;
  showRoles?: boolean;
  hasProducts?: boolean;
}

export default function UserDetailsCardWrapper({
  user,
  showFlag,
  showRoles,
  hasProducts,
}: UserDetailsCardWrapperProps) {
  return user.isLightTheme ? (
    <UserDetailsCardLight
      user={user}
      showFlag={showFlag}
      showRoles={showRoles}
      hasProducts={hasProducts}
    />
  ) : (
    <UserDetailsCard
      user={user}
      showFlag={showFlag}
      showRoles={showRoles}
      hasProducts={hasProducts}
    />
  );
}
