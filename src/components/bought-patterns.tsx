'use client';

import PatternCard from './pattern-card';
import { useListPatterns } from '@/lib/api/pattern';
import { useEffect } from 'react';
import NoPatterns from '@/lib/components/NoPatterns';

export default function BoughtPatterns() {
  const { fetch: fetchPatterns, data: patterns } = useListPatterns({});

  useEffect(() => {
    fetchPatterns();
  }, []);

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">My Patterns</h1>
      <div className="grid grid-cols-1 gap-6">
        {patterns.length === 0 ? <NoPatterns /> : null}
        {patterns.map((pattern) => (
          <PatternCard key={pattern.orderId} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}
