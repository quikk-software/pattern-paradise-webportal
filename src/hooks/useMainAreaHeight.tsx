'use client';

import { useEffect, useState } from 'react';

export default function useMainAreaHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById('main-area');
      if (element) {
        setHeight(element.offsetHeight);
      }
    }
  }, []);

  return height;
}
