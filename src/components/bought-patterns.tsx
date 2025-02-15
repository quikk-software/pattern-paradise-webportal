'use client';

import PatternCard from './pattern-card';
import { useListPatterns } from '@/lib/api/pattern';
import { useEffect } from 'react';

export default function BoughtPatterns() {
  const { fetch: fetchPatterns, data: patterns } = useListPatterns({});

  useEffect(() => {
    fetchPatterns();
  }, []);

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-3xl font-bold">Your Patterns</h1>
      <div className="grid grid-cols-1 gap-6">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.orderId} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}
