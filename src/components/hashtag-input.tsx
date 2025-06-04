'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from 'use-intl';

interface HashtagInputProps {
  hashtags: string[];
  setHashtags: (hashtags: string[]) => void;
  limit?: number;
}

export default function HashtagInput({ hashtags, setHashtags, limit }: HashtagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const t = useTranslations();

  const addHashtag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (trimmedTag && !hashtags.includes(trimmedTag)) {
      setHasError(false);
      setHashtags([...hashtags, trimmedTag]);
      setInputValue('');
    } else {
      setHasError(true);
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const clearAllHashtags = () => {
    setHashtags([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addHashtag(inputValue.toLowerCase());
    }
  };

  const hasLimit = !!limit;
  const hashtagCount = hashtags.length;
  const progressPercentage = hasLimit ? (hashtagCount / limit) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t('common.hashtagsPlaceholder')}
          value={inputValue}
          disabled={!!limit && hashtags.length >= limit}
          onChange={(e) => {
            setHasError(false);
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={clearAllHashtags}
          disabled={hashtagCount === 0}
        >
          <Trash2 />
        </Button>
      </div>
      {!!inputValue && hasError ? (
        <p className="text-sm text-red-500 mb-2">
          {t('common.hashtagsError', {
            inputValue,
          })}
        </p>
      ) : null}
      {hasLimit ? (
        <div>
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-1">
            {hashtagCount} / {limit} {t('common.hashtagsLimit')}
          </p>
        </div>
      ) : null}
      {hashtags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, index) => (
            <div
              key={index}
              className="bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center"
            >
              #{tag}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-5 w-5"
                onClick={(event) => {
                  event.preventDefault();
                  removeHashtag(tag);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
