'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'use-intl';

export default function Trustpilot() {
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    // @ts-ignore
    if (window?.['Trustpilot']) {
      // @ts-ignore
      window['Trustpilot'].loadFromElement(document.querySelector('.trustpilot-widget'), true);
    }
  }, [isMounted]);

  // Render a placeholder on server to avoid hydration mismatch
  // The Trustpilot script modifies the DOM on client, causing mismatch
  if (!isMounted) {
    return (
      <div>
        <div style={{ textAlign: 'left', height: '52px' }}>
          {/* Placeholder to match approximate widget height */}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'left' }}>
        <div
          className="trustpilot-widget"
          data-locale={locale}
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="68380deedb84260d90932392"
          data-style-height="52px"
          data-style-width="100%"
          suppressHydrationWarning
        >
          <a
            href="https://www.trustpilot.com/review/pattern-paradise.shop"
            target="_blank"
            rel="noopener"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
}
