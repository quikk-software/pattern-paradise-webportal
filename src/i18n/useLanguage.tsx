'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

import { Language } from '@/i18n/i18n.types';
import { TOptions } from 'i18next';
import { Store } from '@/lib/redux/store';
import { setLanguage } from '@/lib/features/i18n/i18nSlice';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/i18n/i18n.constants';

const useLanguage = () => {
  const dispatch = useDispatch();
  const { language: languageInStore } = useSelector((s: Store) => s.i18n);
  const { i18n } = useTranslation();
  const { language: languageInI18n, changeLanguage: changeLanguageInI18n, t: tFromI18n } = i18n;

  const params = useParams();
  const langFromUrl = (params?.lang as Language) || DEFAULT_LANGUAGE;
  const isValidLang = LANGUAGES.includes(langFromUrl);

  const changeLanguage = async (language: Language) => {
    dispatch(setLanguage(language));
    await changeLanguageInI18n(language);
  };

  const t = (key: string, options?: TOptions) => {
    return tFromI18n(key, options);
  };

  useEffect(() => {
    if (!isValidLang) return;

    const syncLanguage = async () => {
      if (languageInStore !== langFromUrl) {
        dispatch(setLanguage(langFromUrl));
      }

      if (languageInI18n !== langFromUrl) {
        await changeLanguageInI18n(langFromUrl);
      }
    };

    syncLanguage();
  }, [langFromUrl, languageInStore, languageInI18n, dispatch]);

  return { language: langFromUrl, changeLanguage, t };
};

export default useLanguage;
