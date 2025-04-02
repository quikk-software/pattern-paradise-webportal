'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { EMAIL_REGEX, SUPPORT_EMAIL } from '@/lib/constants';
import { MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useAction from '@/lib/core/useAction';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { Store } from '@/lib/redux/store';
import { useCreateChat } from '@/lib/api';
import Link from 'next/link';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const { userId } = useSelector((s: Store) => s.auth);

  const { action } = useAction();

  const { status, data: session } = useSession();

  const { mutate: createChat } = useCreateChat();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    switch (action) {
      case 'preselectPaymentProblem':
        setSelectValue('payment');
        break;
      default:
        break;
    }
  }, [action]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsError(false);
    setIsSubmitted(false);

    try {
      await axios.post('/api/mails/contact', {
        name: data.name,
        email: data.email,
        message: data.message,
        reason: selectValue,
      });
      setIsSubmitted(true);
      reset();
      setSelectValue('');
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectChange = (value: string) => {
    setSelectValue(value);
  };

  const handleChatClick = (initiatorUserId: string, correspondenceUserId: string) => {
    createChat([correspondenceUserId, initiatorUserId]).then((chatId) => {
      router.push(`/app/secure/chats?chatId=${chatId}`);
    });
  };

  const canOpenSupportChat =
    userId && process.env.NEXT_PUBLIC_SUPPORT_USER_ID && status === 'authenticated';

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
        <CardDescription>
          We&apos;re here to help. Choose how you&apos;d like to reach us.
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          {canOpenSupportChat ? (
            <div
              className="flex-1 py-6 flex flex-col items-center gap-2 bg-muted/30 rounded-md cursor-pointer hover:shadow-md"
              onClick={() => handleChatClick(userId, process.env.NEXT_PUBLIC_SUPPORT_USER_ID ?? '')}
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Chat with Support</span>
              <span className="text-xs text-muted-foreground">Get help in real-time</span>
            </div>
          ) : null}

          <Link
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex-1 py-6 flex flex-col items-center gap-2 bg-muted/30 rounded-md cursor-pointer hover:shadow-md"
          >
            <div className="bg-primary/10 p-2 rounded-full">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <span className="font-medium">Send us an Email</span>
            <span className="text-xs text-muted-foreground">We&apos;ll respond within 24h</span>
          </Link>
        </div>
      </div>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Your name"
                defaultValue={session?.user.name ?? undefined}
                className="bg-background"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
              {errors.name ? <p className="text-red-500 text-sm">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Your email"
                defaultValue={session?.user.email ?? undefined}
                className="bg-background"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email ? <p className="text-red-500 text-sm">{errors.email.message}</p> : null}
            </div>
          </div>

          <div>
            <Select onValueChange={onSelectChange} value={selectValue}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select a reason for contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="refund">Refund Request</SelectItem>
                <SelectItem value="usage">Question about Usage</SelectItem>
                <SelectItem value="listing">Listing Issue</SelectItem>
                <SelectItem value="payment">Payment Problem</SelectItem>
                <SelectItem value="account">Account Support</SelectItem>
                <SelectItem value="bug">Report a Bug</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Please provide details about your inquiry..."
              className="resize-none min-h-[150px] bg-background"
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Message must be at least 10 characters' },
              })}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isSubmitted}>
            {isSubmitting ? (
              <LoadingSpinnerComponent size="sm" className="mr-2" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send Message
          </Button>
        </form>

        {isSubmitted ? (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
            <p className="font-medium">Your message has been submitted successfully!</p>
            <p className="text-sm mt-1">We&apos;ll get back to you within 24-48 hours.</p>
          </div>
        ) : null}

        {isError ? (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
            <p className="font-medium">Your message was not delivered.</p>
            <p className="text-sm mt-1">Please check your data input and try again.</p>
          </div>
        ) : null}
      </CardContent>

      {canOpenSupportChat ? (
        <CardFooter className="flex justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">Need immediate assistance?</p>
          <Button
            variant="link"
            onClick={() => handleChatClick(userId, process.env.NEXT_PUBLIC_SUPPORT_USER_ID ?? '')}
            className="text-primary flex items-center gap-1 p-0"
          >
            Start a chat <ArrowRight className="h-3 w-3" />
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
