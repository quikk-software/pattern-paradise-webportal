'use client';

import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCookies } from 'next-client-cookies';
import { COOKIE_CONSENT_NAME } from '@/lib/constants';
import { Analytics } from '@vercel/analytics/react';
import { usePreview } from '@/app/providers/PreviewFlagProvider';

interface CookieConsentBannerProps {
  maintenanceMode: boolean;
}

export default function CookieConsentBanner({ maintenanceMode }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const cookieStore = useCookies();

  const { isPreview } = usePreview();

  useEffect(() => {
    const consent = cookieStore.get(COOKIE_CONSENT_NAME);
    const localStorageConsent = localStorage.getItem(COOKIE_CONSENT_NAME);
    if (consent === undefined && localStorageConsent === null) {
      setVisible(true);
    }
    if (consent === 'true' || localStorageConsent === 'true') {
      setConsentGiven(true);
    }
  }, [cookieStore]);

  const handleAccept = () => {
    cookieStore.set(COOKIE_CONSENT_NAME, 'true', { path: '/' });
    localStorage.setItem(COOKIE_CONSENT_NAME, 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    cookieStore.set(COOKIE_CONSENT_NAME, 'false', { path: '/' });
    localStorage.removeItem(COOKIE_CONSENT_NAME);
    setVisible(false);
  };

  if (isPreview) return null;

  if (typeof window !== 'undefined') {
    return (
      <>
        {/* {consentGiven ? <Analytics /> : null} */}
        <Analytics />
        {visible ? (
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            declineButtonText="Decline"
            cookieName={COOKIE_CONSENT_NAME}
            style={{ background: 'none', position: 'relative' }}
            contentStyle={{ margin: 0 }}
            buttonStyle={{ display: 'none' }}
            declineButtonStyle={{ display: 'none' }}
            expires={150}
            onAccept={handleAccept}
            onDecline={handleDecline}
          >
            <div className="fixed bottom-0 left-0 w-full z-50 bg-background border-t border-border shadow-lg p-4">
              <div className="items-center justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold mb-2 text-primary">
                      We value your privacy 🍪
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your browsing experience. By clicking
                      &apos;Accept&apos;, you consent to our use of cookies.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    {maintenanceMode ? null : (
                      <Link rel={'nofollow'} href="/terms-and-privacy?action=scrollToPrivacyPolicy">
                        <Button variant="link">Privacy Policy</Button>
                      </Link>
                    )}
                    <Button variant="secondary" onClick={handleDecline}>
                      Decline
                    </Button>
                    <Button onClick={handleAccept}>Accept</Button>
                  </div>
                </div>
              </div>
            </div>
          </CookieConsent>
        ) : null}
      </>
    );
  }

  return null;
}
