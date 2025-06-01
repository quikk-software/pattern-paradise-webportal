import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from '@/i18n/i18n.constants';
import { Language } from '@/i18n/i18n.types';

export type I18nState = {
  language: Language;
};

export const initialState: I18nState = {
  language: DEFAULT_LANGUAGE,
};

export const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
  },
});

export const { setLanguage } = i18nSlice.actions;
export default i18nSlice.reducer;
