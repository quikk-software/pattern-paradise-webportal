import React, { useState } from 'react';
import { useUpdateUserPassword } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useForm } from 'react-hook-form';
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/lib/constants';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';

const passwordProps: {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
} = {
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
};

export default function EditPassword() {
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [updateUserPasswordIsError, setUpdateUserPasswordIsError] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: passwordProps });

  const {
    mutate: mutateUserPassword,
    isLoading: updateUserPasswordIsLoading,
    isSuccess: updateUserPasswordIsSuccess,
  } = useUpdateUserPassword();

  const onPasswordSubmit = async (data: any) => {
    setPasswordError(undefined);
    setUpdateUserPasswordIsError(false);

    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    mutateUserPassword(userId, {
      password: data.newPassword,
      oldPassword: data.oldPassword,
    }).catch(() => {
      setUpdateUserPasswordIsError(true);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-8">
          <div className="grid xs:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Old Password</Label>
              <Input
                id="oldPassword"
                type="password"
                autoComplete="old-password"
                {...register('oldPassword', {
                  required: 'Old password is required',
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...register('newPassword', {
                  required: 'New password is required',
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: PASSWORD_REGEX_MESSAGE,
                  },
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: PASSWORD_REGEX_MESSAGE,
                  },
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            {passwordError ? <p className="text-yellow-600 text-sm mt-2">{passwordError}</p> : null}
            <RequestStatus
              isSuccess={updateUserPasswordIsSuccess}
              isError={updateUserPasswordIsError}
              errorMessage={
                'Saving your new password failed. Please check your input and try again.'
              }
            />
            <Button type="submit" className="w-full" disabled={updateUserPasswordIsLoading}>
              {updateUserPasswordIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Save Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
