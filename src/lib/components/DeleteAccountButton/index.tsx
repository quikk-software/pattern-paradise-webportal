import React, { useState } from 'react';
import { useValidSession } from '@/hooks/useValidSession';
import { Button } from '@/components/ui/button';
import ConfirmDrawer from '@/lib/components/ConfirmDrawer';
import { useDeleteUser } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { signOut } from 'next-auth/react';

export default function DeleteAccountButton() {
  const [isDeleteAccountDrawerOpen, setIsDeleteAccountDrawerOpen] = useState(false);

  const { data: session } = useValidSession();

  const {
    mutate: deleteUser,
    isLoading: deleteUserIsLoading,
    errorDetail: deleteUserErrorDetail,
    isError: deleteUserIsError,
    isSuccess: deleteUserIsSuccess,
  } = useDeleteUser();

  const handleDeleteAccount = () => {
    if (!session?.user.id) {
      return;
    }
    deleteUser(session?.user.id).then(() => {
      signOut({ redirect: false });
    });
  };

  if (!session?.user.id) {
    return null;
  }

  if (deleteUserIsSuccess) {
    return <p className="text-green-500">You will be logged out automatically...</p>;
  }

  return (
    <>
      <Button
        variant={'outline'}
        className="border-red-500 text-red-500"
        disabled={deleteUserIsLoading}
        onClick={() => setIsDeleteAccountDrawerOpen(true)}
      >
        {deleteUserIsLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
        Delete Account
      </Button>
      <ConfirmDrawer
        isOpen={isDeleteAccountDrawerOpen}
        setIsOpen={setIsDeleteAccountDrawerOpen}
        description={
          deleteUserIsError
            ? `Account deletion failed: ${deleteUserErrorDetail ? deleteUserErrorDetail : 'Unknown error'}`
            : 'You are about to irreversibly delete your account. Continue?'
        }
        callbackFn={handleDeleteAccount}
      />
    </>
  );
}
