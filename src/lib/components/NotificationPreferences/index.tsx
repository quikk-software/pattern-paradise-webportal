'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import { getDeviceToken } from '@/lib/notifications/device-token';
import { Store } from '@/lib/redux/store';
import {
  useGetDeviceToken,
  useCreateDeviceToken,
  useUpdateDeviceToken,
  useDeleteDeviceToken,
} from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GetDeviceTokenResponse } from '@/@types/api-types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import RequestStatus from '@/lib/components/RequestStatus';

type NotificationType = 'DIRECT_MESSAGE' | 'TESTER_MESSAGE' | 'PATTERN_SALE';

interface NotificationPreferencesProps {
  disableCard?: boolean;
}

export interface PreferencesCardProps {
  setIsDialogOpen: (isOpen: boolean) => void;
  disableCard: boolean;
  isSubscribed: boolean;
  setIsSubscribed: (value: boolean) => void;
  deviceToken?: GetDeviceTokenResponse;
  getDeviceTokenIsLoading: boolean;
}

export interface NotificationPreference {
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
  const [enableIsLoading, setEnableIsLoading] = useState(false);
  const [disableIsLoading, setDisableIsLoading] = useState(false);

  useEffect(() => {
    if (!deviceToken?.events) {
      return;
    }
    setPreferences([
      {
        type: 'DIRECT_MESSAGE',
        enabled: deviceToken?.events?.includes('DIRECT_MESSAGE') ?? false,
        label: 'Direct Messages',
        description: 'Get notified when someone sends you a direct message',
      },
      {
        type: 'TESTER_MESSAGE',
        enabled: deviceToken?.events?.includes('TESTER_MESSAGE') ?? false,
        label: 'Tester Messages',
        description: 'Get notified about tester-related communications',
      },
      {
        type: 'PATTERN_SALE',
        enabled: deviceToken?.events?.includes('PATTERN_SALE') ?? false,
        label: 'Pattern Sales',
        description: 'Get notified when a pattern has been sold',
      },
    ]);
  }, [deviceToken?.events]);

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

  const handleTogglePreference = (type: NotificationType) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.type === type ? { ...pref, enabled: !pref.enabled } : pref)),
    );
  };

  const handleSubscribe = async () => {
    try {
      setEnableIsLoading(true);
      const device = await getDeviceToken();

      if (device?.token) {
        await postDeviceToken(userId, {
          deviceToken: device.token,
          events: preferences.filter((p) => p.enabled).map((p) => p.type),
          platform: device.platform,
        });

        localStorage.setItem('pushNotificationEnabled', 'true');
        localStorage.removeItem('pushNotificationDeclined');

        setIsSubscribed(true);
        setIsDialogOpen(false);
      }
    } catch (error) {
      logger.error('Error subscribing to push notifications:', error);
    } finally {
      setEnableIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setDisableIsLoading(true);
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });

      await deleteDeviceToken(userId, deviceToken?.deviceToken || '');

      localStorage.removeItem('pushNotificationDeclined');
      localStorage.removeItem('pushNotificationEnabled');

      setIsSubscribed(false);
      setIsDialogOpen(false);
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error);
    } finally {
      setDisableIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!userId || !deviceToken?.deviceToken) return;

    try {
      await putDeviceToken(userId, {
        deviceToken: deviceToken.deviceToken,
        events: preferences.filter((p) => p.enabled).map((p) => p.type),
      });
    } catch (error) {
      logger.error('Error updating preferences:', error);
    }
  };

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
              onClick={handleSavePreferences}
              disabled={putDeviceTokenIsLoading}
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
              onClick={handleUnsubscribe}
              disabled={deleteDeviceTokenIsLoading || disableIsLoading}
              variant="outline"
              className="w-full"
            >
              {deleteDeviceTokenIsLoading || disableIsLoading ? (
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
              disabled={postDeviceTokenIsLoading || enableIsLoading}
              className="w-full"
            >
              {postDeviceTokenIsLoading || enableIsLoading ? (
                <LoadingSpinnerComponent size="sm" className="text-white" />
              ) : null}
              Enable Push Notifications
            </Button>
            <RequestStatus
              isSuccess={postDeviceTokenIsSuccess}
              isError={postDeviceTokenIsError}
              errorMessage={`Something went wrong: ${postDeviceTokenErrorDetail ?? 'No error details found'}. Your app or browser might not support push notifications at this time.`}
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
  const [isDeclined, setIsDeclined] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { userId } = useSelector((s: Store) => s.auth);
  const { status } = useSession();

  const {
    fetch: fetchDeviceToken,
    data: deviceToken,
    isLoading: getDeviceTokenIsLoading,
  } = useGetDeviceToken();

  useEffect(() => {
    if (!userId || status !== 'authenticated') {
      return;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      const pushNotificationEnabled = localStorage.getItem('pushNotificationEnabled');
      const pushNotificationDeclined = localStorage.getItem('pushNotificationDeclined');

      if (Notification.permission === 'denied') {
        setIsDeclined(true);
        return;
      }
      if (Notification.permission === 'default' && pushNotificationDeclined !== 'true') {
        setIsDialogOpen(true);
        return;
      }

      if (pushNotificationDeclined === 'true') {
        return;
      }

      getDeviceToken()
        .then((device) => {
          if (device?.token) {
            fetchDeviceToken(userId, device.token)
              .then((result) => {
                setIsSubscribed(!!result?.deviceToken);
                if (pushNotificationDeclined === 'true' || pushNotificationEnabled === 'true') {
                  return;
                }
                setIsDialogOpen(!result?.deviceToken);
              })
              .catch((error) => {
                logger.error('Error fetching device token:', error);
                if (pushNotificationDeclined === 'true' || pushNotificationEnabled === 'true') {
                  return;
                }
                setIsDialogOpen(true);
              });
          }
        })
        .catch((error) => {
          logger.error('Error initializing push notifications:', error);
        });
    }
  }, [userId, status]);

  if (isDeclined && !disableCard) {
    return (
      <Card className="w-full border-none shadow-none border-0">
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            You have declined push notifications. Please activate them in the browser settings to be
            able to use push notifications for Pattern Paradise.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isSupported && !disableCard) {
    return (
      <Card className="w-full border-none shadow-none border-0">
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
        <Dialog
          open={isDialogOpen}
          onOpenChange={(value) => {
            setIsDialogOpen(value);
            if (!value) {
              localStorage.setItem('pushNotificationDeclined', 'true');
            }
          }}
        >
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
