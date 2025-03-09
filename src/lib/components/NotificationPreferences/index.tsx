'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import logger from '@/lib/core/logger';
import { firebaseConfig, getDeviceToken } from '@/lib/notifications/device-token';
import { initializeApp } from '@firebase/app';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import {
  useGetDeviceToken,
  useCreateDeviceToken,
  useUpdateDeviceToken,
  useDeleteDeviceToken,
} from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GetDeviceTokenResponse } from '@/@types/api-types';

type NotificationType = 'DIRECT_MESSAGE' | 'TESTER_MESSAGE' | 'PATTERN_SALE';

interface NotificationPreferencesProps {
  disableCard?: boolean;
}

interface PreferencesCardProps {
  setIsDialogOpen: (isOpen: boolean) => void;
  disableCard: boolean;
  isSubscribed: boolean;
  setIsSubscribed: (value: boolean) => void;
  deviceToken?: GetDeviceTokenResponse;
  getDeviceTokenIsLoading: boolean;
}

interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  label: string;
  description: string;
}

function PreferencesCard({
  setIsDialogOpen,
  disableCard,
  isSubscribed,
  setIsSubscribed,
  deviceToken,
  getDeviceTokenIsLoading,
}: PreferencesCardProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: 'DIRECT_MESSAGE',
      enabled: true,
      label: 'Direct Messages',
      description: 'Get notified when someone sends you a direct message',
    },
    {
      type: 'TESTER_MESSAGE',
      enabled: true,
      label: 'Tester Messages',
      description: 'Get notified about tester-related communications',
    },
    {
      type: 'PATTERN_SALE',
      enabled: true,
      label: 'Pattern Sales',
      description: 'Get notified when a pattern has been sold',
    },
  ]);

  const { userId } = useSelector((s: Store) => s.auth);

  const {
    mutate: postDeviceToken,
    isLoading: postDeviceTokenIsLoading,
    isSuccess: postDeviceTokenIsSuccess,
    isError: postDeviceTokenIsError,
    errorDetail: postDeviceTokenErrorDetail,
  } = useCreateDeviceToken();
  const {
    mutate: putDeviceToken,
    isLoading: putDeviceTokenIsLoading,
    isSuccess: putDeviceTokenIsSuccess,
    isError: putDeviceTokenIsError,
    errorDetail: putDeviceTokenErrorDetail,
  } = useUpdateDeviceToken();
  const {
    mutate: deleteDeviceToken,
    isLoading: deleteDeviceTokenIsLoading,
    isSuccess: deleteDeviceTokenIsSuccess,
    isError: deleteDeviceTokenIsError,
    errorDetail: deleteDeviceTokenErrorDetail,
  } = useDeleteDeviceToken();

  useEffect(() => {
    if (!deviceToken?.deviceToken) {
      return;
    }
    setPreferences([
      {
        type: 'DIRECT_MESSAGE',
        enabled: !!deviceToken.events?.find((x) => x === 'DIRECT_MESSAGE'),
        label: 'Direct Messages',
        description: 'Get notified when someone sends you a direct message',
      },
      {
        type: 'TESTER_MESSAGE',
        enabled: !!deviceToken.events?.find((x) => x === 'TESTER_MESSAGE'),
        label: 'Tester Messages',
        description: 'Get notified about tester-related communications',
      },
      {
        type: 'PATTERN_SALE',
        enabled: !!deviceToken.events?.find((x) => x === 'PATTERN_SALE'),
        label: 'Pattern Sales',
        description: 'Get notified when a pattern has been sold',
      },
    ]);
  }, [deviceToken]);

  const handleTogglePreference = (type: NotificationType) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.type === type ? { ...pref, enabled: !pref.enabled } : pref)),
    );
  };

  const handleSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');

      if (!registration) {
        return;
      }

      Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
          await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              'BLAuhDOnKtEgZoVeFR6KSqga0xt59mOseRP6QL-uOoEnv1nrozU_68MAIVO6wCDB8CZa33k94jgKcHUWrzDd51g',
          });
          getDeviceToken(initializeApp(firebaseConfig)).then((result) => {
            if (result?.token) {
              postDeviceToken(userId, {
                events: preferences
                  .filter((preference) => preference.enabled)
                  .map((preference) => preference.type),
                deviceToken: result.token,
                platform: result.platform,
              }).then(() => {
                setIsSubscribed(true);
                setIsDialogOpen(false);
              });
            }
          });
        }
      });
    } catch (error) {
      logger.error('Error subscribing to push notifications:', error);
    }
  };

  const handleUnsubscribe = async () => {
    if (!userId || !deviceToken?.deviceToken) {
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await deleteDeviceToken(userId, deviceToken.deviceToken);

        setIsSubscribed(false);
        setIsDialogOpen(false);
      }
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error);
    }
  };

  const handleSavePreferences = async (preferences: NotificationPreference[]) => {
    if (!userId || !deviceToken?.deviceToken) {
      return;
    }
    if (isSubscribed) {
      try {
        console.log({ preferences });
        await putDeviceToken(userId, {
          deviceToken: deviceToken?.deviceToken,
          events: preferences
            .filter((preference) => preference.enabled)
            .map((preference) => preference.type),
        });
      } catch (error) {
        logger.error('Error saving preferences:', error);
      }
    }
  };

  const isDisabled = !userId || !deviceToken?.deviceToken;

  return (
    <Card className={`w-full${disableCard ? ' border-none shadow-none border-0' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          Push Notifications
        </CardTitle>
        <CardDescription>Choose which notifications you&apos;d like to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferences.map((pref) => (
          <div key={pref.type} className="flex items-start space-x-2">
            <Checkbox
              id={pref.type}
              checked={pref.enabled}
              onCheckedChange={() => handleTogglePreference(pref.type)}
              disabled={getDeviceTokenIsLoading}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={pref.type} className={!isSubscribed ? 'text-muted-foreground' : ''}>
                {pref.label}
              </Label>
              <p className="text-sm text-muted-foreground">{pref.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {isSubscribed ? (
          <>
            <Button
              disabled={isDisabled || putDeviceTokenIsLoading}
              onClick={() => handleSavePreferences(preferences)}
              className="w-full"
            >
              {putDeviceTokenIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Save Preferences
            </Button>
            <RequestStatus
              isSuccess={putDeviceTokenIsSuccess}
              isError={putDeviceTokenIsError}
              errorMessage={putDeviceTokenErrorDetail}
            />
            <Button
              disabled={isDisabled || deleteDeviceTokenIsLoading}
              variant="outline"
              onClick={handleUnsubscribe}
              className="w-full"
            >
              {deleteDeviceTokenIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Unsubscribe from Notifications
            </Button>
            <RequestStatus
              isSuccess={deleteDeviceTokenIsSuccess}
              isError={deleteDeviceTokenIsError}
              errorMessage={deleteDeviceTokenErrorDetail}
            />
          </>
        ) : (
          <>
            <Button
              onClick={handleSubscribe}
              disabled={postDeviceTokenIsLoading}
              className="w-full"
            >
              {postDeviceTokenIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Enable Push Notifications
            </Button>
            <RequestStatus
              isSuccess={postDeviceTokenIsSuccess}
              isError={postDeviceTokenIsError}
              errorMessage={postDeviceTokenErrorDetail}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default function NotificationPreferences({
  disableCard = false,
}: NotificationPreferencesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);

  const {
    fetch: fetchDeviceToken,
    data: deviceToken,
    isLoading: getDeviceTokenIsLoading,
  } = useGetDeviceToken();

  useEffect(() => {
    if (!userId) {
      return;
    }
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);

      getDeviceToken(initializeApp(firebaseConfig))
        .then((device) => {
          if (device?.token) {
            fetchDeviceToken(userId, device.token)
              .then((result) => {
                setIsSubscribed(!!result?.deviceToken);
                setIsDialogOpen(!result?.deviceToken);
              })
              .catch((error) => {
                logger.error('Error fetching device token:', error);
                setIsDialogOpen(true);
              });
            return;
          }
          setIsDialogOpen(false);
        })
        .catch((error) => {
          logger.error('Error checking subscription:', error);
        });
    }
  }, [userId]);

  if (!isSupported && !disableCard) {
    return (
      <Card className={'w-full border-none shadow-none border-0'}>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Push notifications are not supported in your browser.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {disableCard ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <PreferencesCard
              setIsDialogOpen={setIsDialogOpen}
              disableCard={disableCard}
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
              deviceToken={deviceToken}
              getDeviceTokenIsLoading={getDeviceTokenIsLoading}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <PreferencesCard
          setIsDialogOpen={setIsDialogOpen}
          disableCard={disableCard}
          isSubscribed={isSubscribed}
          setIsSubscribed={setIsSubscribed}
          deviceToken={deviceToken}
          getDeviceTokenIsLoading={getDeviceTokenIsLoading}
        />
      )}
    </>
  );
}
