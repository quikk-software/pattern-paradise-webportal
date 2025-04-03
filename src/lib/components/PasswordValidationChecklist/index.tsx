'use client';
import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export function PasswordValidationChecklist({ password }: { password: string }) {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters long',
      regex: /.{8,}/,
      met: /.{8,}/.test(password),
    },
    {
      label: 'Contains at least one lowercase letter (a-z)',
      regex: /[a-z]/,
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains at least one uppercase letter (A-Z)',
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains at least one number (0-9)',
      regex: /\d/,
      met: /\d/.test(password),
    },
    {
      label: 'Contains at least one special character (@$!%*?&#)',
      regex: /[@$!%*?&#]/,
      met: /[@$!%*?&#]/.test(password),
    },
    {
      label: 'Only contains allowed characters (letters, numbers, @$!%*?&#)',
      regex: /^[A-Za-z\d@$!%*?&#]+$/,
      met: password === '' || /^[A-Za-z\d@$!%*?&#]+$/.test(password),
    },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);
  const anyRequirementChecked = password.length > 0;

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2 text-sm">
      <p className="font-medium">Password requirements:</p>
      <ul className="space-y-1 pl-1">
        {requirements.map((requirement, index) => (
          <li key={index} className="flex items-start gap-2">
            {requirement.met ? (
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <span className={requirement.met ? 'text-green-700' : 'text-red-700'}>
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>

      {anyRequirementChecked && (
        <div className="pt-1">
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${allRequirementsMet ? 'bg-green-500' : 'bg-amber-500'}`}
              style={{
                width: `${(requirements.filter((r) => r.met).length / requirements.length) * 100}%`,
              }}
            />
          </div>
          <p className={`text-xs mt-1 ${allRequirementsMet ? 'text-green-700' : 'text-amber-700'}`}>
            {allRequirementsMet
              ? 'Password meets all requirements!'
              : `${requirements.filter((r) => r.met).length}/${requirements.length} requirements met`}
          </p>
        </div>
      )}
    </div>
  );
}
