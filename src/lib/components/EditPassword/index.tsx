import React, { useState } from 'react';
import { useUpdateUserPassword } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { useForm } from 'react-hook-form';

const passwordProps: {
  newPassword?: string;
  confirmPassword?: string;
} = {
  newPassword: undefined,
  confirmPassword: undefined,
};

export default function EditPassword() {
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [updateUserPasswordIsError, setUpdateUserPasswordIsError] = useState(false);

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
    mutateUserPassword({
      password: data.newPassword,
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
        <CardTitle className="text-2xl font-bold text-center">Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-8">
          <div className="grid xs:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...register('newPassword', {
                  required: 'New password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    message:
                      'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
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
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    message:
                      'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
                  },
                })}
                onKeyDown={handleKeyDown}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={updateUserPasswordIsLoading}>
              {updateUserPasswordIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Save Password
            </Button>
            <RequestStatus
              isSuccess={updateUserPasswordIsSuccess}
              isError={updateUserPasswordIsError}
              errorMessage={
                'Saving your new password failed. Please check your input and try again.'
              }
            />
            {passwordError ? <p className="text-yellow-600 text-sm mt-2">{passwordError}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
