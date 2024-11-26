import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InsufficientRolesProps {
  roleType: 'Tester' | 'Seller';
}

export default function InsufficientRoles({ roleType }: InsufficientRolesProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Insufficient Roles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <svg
            className="w-32 h-32 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-center text-gray-600">
            You don&apos;t have the necessary role <strong>{roleType}</strong> to access this page.
            Please add this role to your profile to continue.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/app/auth/me">Add Role {roleType}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
