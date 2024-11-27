'use client';

import { useForm } from 'react-hook-form';
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
import axios from 'axios';
import React, { useState } from 'react';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';

type FormData = {
  name: string;
  email: string;
  reason: string;
  message: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsError(false);
    setIsSubmitted(false);

    axios
      .post('/api/mails/contact', {
        name: data.name,
        email: data.email,
        message: data.message,
        reason: selectValue,
      })
      .then(() => {
        setIsSubmitted(true);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const onSelectChange = (value: string) => setSelectValue(value);

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            placeholder="Your name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Input
            placeholder="Enter an email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Select onValueChange={onSelectChange} defaultValue={selectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
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

        <div>
          <Textarea
            placeholder="Please provide details about your inquiry..."
            className="resize-none"
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
            })}
          />
          {errors.message && <p className="text-red-500">{errors.message.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || isSubmitted}>
          {isSubmitting ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
          Submit
        </Button>
        {isSubmitted ? (
          <p className="text-center text-green-500">
            Your message has been submitted successfully. We&apos;ll get back to you soon.
          </p>
        ) : null}
        {isError ? (
          <p className="text-center text-red-500">
            Your message was not delivered. Please check your data input and try again.
          </p>
        ) : null}
      </form>
    </div>
  );
}
