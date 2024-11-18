'use client';

import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

type SeverityLevel = 'info' | 'success' | 'warning' | 'error';

interface InfoBoxProps {
  severity?: SeverityLevel;
  title?: string;
  message: string | React.ReactNode;
}

const severityConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    iconColor: 'text-green-400',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    iconColor: 'text-yellow-400',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    iconColor: 'text-red-400',
  },
};

export function InfoBoxComponent({ severity = 'info', title, message }: InfoBoxProps) {
  const { icon: Icon, bgColor, textColor, borderColor, iconColor } = severityConfig[severity];

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <div className="flex items-start">
        <div className={`mr-3 flex-shrink-0 ${iconColor}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
          <div className={`text-sm ${textColor}`}>{message}</div>
        </div>
      </div>
    </div>
  );
}
