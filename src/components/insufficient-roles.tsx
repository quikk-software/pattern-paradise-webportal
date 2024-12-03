import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import GoBackButton from '@/lib/components/GoBackButton';

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
          <ShieldAlert className="w-32 h-32 text-primary" />
          <p className="text-center text-gray-600">
            You don&apos;t have the necessary role <strong>&apos;{roleType}&apos;</strong> to access
            this page. Please add this role to your profile to continue.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col justify-center items-center gap-2 w-full">
          <GoBackButton />
          <Button asChild className="w-full">
            <Link href="/app/secure/auth/me?action=scrollToRoles">Add Role {roleType}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
