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
import { useStoreDeviceToken } from '@/lib/api';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';

type NotificationType = 'DIRECT_MESSAGE' | 'TESTER_MESSAGE' | 'PATTERN_SALE';

interface NotificationPreferencesProps {
  callback?: (value: boolean) => void;
  disableCard?: boolean;
}

interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  label: string;
  description: string;
}

export default function NotificationPreferences({
  callback,
  disableCard = false,
}: NotificationPreferencesProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
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
    mutate,
    isLoading,
    isSuccess: storeDeviceTokenIsSuccess,
    isError: storeDeviceTokenIsError,
    errorDetail: storeDeviceTokenErrorDetail,
  } = useStoreDeviceToken();

  useEffect(() => {
    const checkSupport = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);

        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
          // callback?.(!subscription);
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };

    checkSupport();
  }, [callback]);

  const handleTogglePreference = (type: NotificationType) => {
    setPreferences((prev) =>
      prev.map((pref) => (pref.type === type ? { ...pref, enabled: !pref.enabled } : pref)),
    );
  };

  const handleSubscribe = async () => {
    try {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          getDeviceToken(initializeApp(firebaseConfig)).then((result) => {
            if (result?.token) {
              mutate(userId, {
                deviceToken: result.token,
                platform: result.platform,
              }).then(() => {
                setIsSubscribed(true);
                callback?.(false);
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
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await deleteSubscription();

        setIsSubscribed(false);
        callback?.(false);
      }
    } catch (error) {
      logger.error('Error unsubscribing from push notifications:', error);
    }
  };

  const handleSavePreferences = async () => {
    if (isSubscribed) {
      try {
        // TODO: save changes
      } catch (error) {
        logger.error('Error saving preferences:', error);
      }
    }
  };

  const deleteSubscription = async () => {
    // In a real app, you would send this to your server
    console.log('Deleting subscription');
    // await fetch('/api/notifications/unsubscribe', {
    //   method: 'DELETE'
    // })
  };

  if (!isSupported) {
    return (
      <Card className={`w-full${disableCard ? ' border-none shadow-none border-0' : ''}`}>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Push notifications are not supported in your browser.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
              disabled={!isSubscribed}
              onCheckedChange={() => handleTogglePreference(pref.type)}
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
            <Button onClick={handleSavePreferences} className="w-full">
              Save Preferences
            </Button>
            <Button variant="outline" onClick={handleUnsubscribe} className="w-full">
              Unsubscribe from Notifications
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
              {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
              Enable Push Notifications
            </Button>
            <RequestStatus
              isSuccess={storeDeviceTokenIsSuccess}
              isError={storeDeviceTokenIsError}
              errorMessage={storeDeviceTokenErrorDetail}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
