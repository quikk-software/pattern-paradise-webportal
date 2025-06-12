'use client';

import React, { useEffect } from 'react';
import { useLocale } from 'use-intl';

export default function Trustpilot() {
  const locale = useLocale();

  useEffect(() => {
    // @ts-ignore
    if (window?.['Trustpilot']) {
      // @ts-ignore
      window['Trustpilot'].loadFromElement(document.querySelector('.trustpilot-widget'), true);
    }
  }, []);

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
