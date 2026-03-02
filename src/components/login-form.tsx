'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import useAuth from '@/lib/auth/useAuth';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestPasswordDrawer from '@/lib/components/RequestPasswordDrawer';
import useRedirect from '@/lib/core/useRedirect';
import GoogleLoginButton from '@/lib/components/GoogleLoginButton';
import SectionDivider from '@/lib/components/SectionDivider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useTranslations } from 'use-intl';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRequestPasswordDrawerOpen, setIsRequestPasswordDrawerOpen] = useState(false);

  const { redirectUrl } = useRedirect();
  const t = useTranslations('login');

  const {
    handleLogin,
    loginStates: { isLoading, isSuccess, isError, error: loginError },
  } = useAuth();

  const isPasswordResetRequired = loginError === 'PASSWORD_RESET_REQUIRED';

  useEffect(() => {
    if (isPasswordResetRequired) {
      setIsRequestPasswordDrawerOpen(true);
    }
  }, [isPasswordResetRequired]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleLogin(email.toLowerCase().trim(), password.trim());
  };

  const disabled = !email || !password || isLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <GoogleLoginButton callbackUrl={redirectUrl} />
        <SectionDivider />
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={disabled}>
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              {t('submitButton')}
            </Button>
            {isPasswordResetRequired ? (
              <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700">
                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">
                  {t('passwordResetRequired.title')}
                </AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  <p className="mt-1">{t('passwordResetRequired.description')}</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 mt-2 text-amber-800 dark:text-amber-300 underline font-semibold"
                    onClick={() => setIsRequestPasswordDrawerOpen(true)}
                  >
                    {t('passwordResetRequired.action')}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <RequestStatus
                isSuccess={isSuccess}
                isError={isError}
                errorMessage={t('loginFailed')}
              />
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-4">
        <p className="text-sm text-muted-foreground text-right">
          {t('noAccount')}{' '}
          <Link
            href={`/auth/registration?redirect=${redirectUrl}`}
            className="text-primary hover:underline"
          >
            {t('registerLink')}
          </Link>
        </p>
        <p className="text-sm text-muted-foreground text-right">
          {t('forgotPassword')}{' '}
          <span
            onClick={() => setIsRequestPasswordDrawerOpen(true)}
            className="text-primary hover:underline cursor-pointer"
          >
            {t('resetLink')}
          </span>
        </p>
      </CardFooter>
      {isRequestPasswordDrawerOpen ? (
        <RequestPasswordDrawer
          drawerIsOpen={isRequestPasswordDrawerOpen}
          setDrawerIsOpen={setIsRequestPasswordDrawerOpen}
          message={isPasswordResetRequired ? t('passwordResetRequired.drawerMessage') : undefined}
        />
      ) : null}
    </Card>
  );
}
