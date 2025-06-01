import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Language } from '@/i18n/i18n.types';
import { TOptions } from 'i18next';
import { Store } from '@/lib/redux/store';
import { setLanguage } from '@/lib/features/i18n/i18nSlice';

const useLanguage = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((s: Store) => s.i18n);
  const { i18n } = useTranslation();
  const { language: languageFromI18n, changeLanguage: changeLanguageFromI18n, t: tFromI18n } = i18n;

  const changeLanguage = async (language: Language) => {
    dispatch(setLanguage(language));
    await changeLanguageFromI18n(language);
  };

  const t = (key: string, options?: TOptions) => {
    return tFromI18n(key, options);
  };

  useEffect(() => {
    const handleUseEffect = async () => {
      if (language !== languageFromI18n) {
        await changeLanguage(language);
      }
    };
    handleUseEffect();
  }, [language, languageFromI18n]);

  return { language, changeLanguage, t };
};
export default useLanguage;
