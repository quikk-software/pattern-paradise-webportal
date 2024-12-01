'use client';

import { useState, useEffect } from 'react';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const COOKIE_CONSENT_NAME = 'pp-cookie-consent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consentGiven = Cookies.get(COOKIE_CONSENT_NAME);
    if (consentGiven === undefined) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName={COOKIE_CONSENT_NAME}
      style={{ background: 'none', position: 'relative' }}
      contentStyle={{
        margin: 0,
      }}
      buttonStyle={{ display: 'none' }}
      declineButtonStyle={{ display: 'none' }}
      expires={150}
      onAccept={() => {
        setVisible(false);
      }}
      onDecline={() => {
        setVisible(false);
      }}
    >
      <div className="fixed bottom-0 left-0 w-full z-50 bg-background border-t border-border shadow-lg">
        <div className="container mx-auto items-center justify-between gap-4 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold mb-2 text-primary">We value your privacy 🍪</h2>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience. By clicking &apos;Accept&apos;,
                you consent to our use of cookies.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Link href="/terms-and-privacy?action=scrollToPrivacyPolicy">
                <Button variant="link">Privacy Policy</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  const declineButton = document.getElementById('rcc-decline-button');
                  if (declineButton instanceof HTMLElement) {
                    declineButton.click();
                  }
                }}
              >
                Decline
              </Button>
              <Button
                onClick={() => {
                  const acceptButton = document.getElementById('rcc-confirm-button');
                  if (acceptButton instanceof HTMLElement) {
                    acceptButton.click();
                  }
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CookieConsent>
  );
}
