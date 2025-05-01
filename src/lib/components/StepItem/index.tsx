'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface StepItemProps {
  number: number;
  title: string;
  isRequired?: boolean;
  isCompleted?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function StepItem({
  number,
  title,
  isRequired = false,
  isCompleted = false,
  children,
  className,
}: StepItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: number * 0.1 }}
      className={cn('relative pl-12 pb-8', className)}
    >
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        {isCompleted ? (
          <CheckCircle size={18} className="text-primary" />
        ) : (
          <span className="text-sm font-medium">{number}</span>
        )}
      </div>
      <div className="absolute left-4 top-8 h-full w-[1px] bg-border" />
      <div>
        <div className="flex items-baseline gap-2">
          <h4 className="text-lg font-semibold">{title}</h4>
          {isRequired && <span className="text-xs font-medium text-destructive">Required</span>}
        </div>
        <div className="mt-2 text-muted-foreground">{children}</div>
      </div>
    </motion.div>
  );
}
