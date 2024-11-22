import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { useRequestPassword } from '@/lib/api';
import { Input } from '@/components/ui/input';
import RequestStatus from '@/lib/components/RequestStatus';

interface RequestPasswordDrawerProps {
  drawerIsOpen: boolean;
  setDrawerIsOpen: (isOpen: boolean) => void;
}

export default function RequestPasswordDrawer({
  drawerIsOpen,
  setDrawerIsOpen,
}: RequestPasswordDrawerProps) {
  const [email, setEmail] = useState('');

  const { mutate, isLoading, isSuccess, isError, errorDetail } = useRequestPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    await mutate({
      email: email.toLowerCase().trim(),
    });
  };

  return (
    <Drawer open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerContent className="p-4">
        <div className="mx-auto w-full max-w-sm flex flex-col gap-8">
          <DrawerHeader className="flex flex-col gap-8 items-center mt-4">
            <DrawerTitle>Request a password mail</DrawerTitle>
            <DrawerTitle className="text-sm font-medium">
              In case you forgot your password, you can request a mail with a one-time code to reset
              your password. <strong>The link expires after 30 minutes!</strong>
            </DrawerTitle>
          </DrawerHeader>
          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value ?? '')}
                required
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Button
                onClick={() => {
                  setDrawerIsOpen(false);
                }}
                variant={'outline'}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading || isSuccess || !email}>
                {isLoading ? (
                  <LoadingSpinnerComponent size={`sm`} className={`text-white`} />
                ) : null}
                Request password mail
              </Button>
              <RequestStatus
                isSuccess={isSuccess}
                isError={isError}
                successMessage={`If your mail ${email
                  .toLowerCase()
                  .trim()} is connected to a user, you will receive an email with further instructions.`}
                errorMessage={
                  errorDetail ??
                  'Something went wrong! Make sure that you have entered a valid mail address.'
                }
              />
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
