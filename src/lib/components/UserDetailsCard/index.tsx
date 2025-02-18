import React from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import { GetUserAccountResponse } from '@/@types/api-types';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import { ReportUser } from '@/lib/components/ReportUser';

const roleOptions = [
  { id: 'Buyer', label: 'Buyer', icon: ShoppingCart },
  { id: 'Seller', label: 'Seller', icon: User },
  {
    id: 'Tester',
    label: 'Tester',
    icon: PatternParadiseIcon,
  },
];

interface UserDetailsCardProps {
  user: GetUserAccountResponse;
  showFlag?: boolean;
  showRoles?: boolean;
}

export default function UserDetailsCard({
  user,
  showFlag = true,
  showRoles = false,
}: UserDetailsCardProps): JSX.Element {
  const hasSocialLinks = user.instagramRef || user.tiktokRef;
  const showCardContent = hasSocialLinks || showRoles;
  return (
    <Card key={user.id} className={`relative cursor-pointer transition-all`}>
      <CardHeader className="flex flex-row justify-between items-start gap-2">
        <Link href={`/users/${user.id}`}>
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              {user.firstName && user.lastName ? (
                <h2 className="text-lg font-semibold underline text-blue-500">
                  {user.firstName} {user.lastName}
                </h2>
              ) : null}
              <p
                className={`${
                  user.firstName && user.lastName ? 'text-sm' : 'text-lg'
                } text-muted-foreground`}
              >
                @{user.username}
              </p>
            </div>
          </div>
        </Link>
        {showFlag ? <ReportUser userId={user.id} /> : null}
      </CardHeader>
      {showCardContent ? (
        <CardContent>
          {hasSocialLinks ? (
            <div className="flex space-x-2 mb-2">
              {user.instagramRef && (
                <a
                  href={`https://instagram.com/${user.instagramRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge variant="secondary">
                    <InstagramIcon className="w-4 h-4 mr-1" />
                    Instagram
                  </Badge>
                </a>
              )}
              {user.tiktokRef && (
                <a
                  href={`https://tiktok.com/@${user.tiktokRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge variant="secondary">
                    <TikTokIcon className="w-4 h-4 mr-1" />
                    TikTok
                  </Badge>
                </a>
              )}
            </div>
          ) : null}
          {showRoles ? (
            <div className="flex gap-2">
              {roleOptions
                .filter((role) => user.roles?.includes(role.id))
                .map((role) => (
                  <Card key={role.id} className={'ring-1 ring-primary flex-1'}>
                    <CardContent className="flex flex-col items-center text-center p-2">
                      <role.icon className="w-4 h-4 mb-1 text-primary" />
                      <h3 className="font-semibold text-sm">{role.label}</h3>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
