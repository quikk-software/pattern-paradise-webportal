import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import {
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem,
} from '@/lib/core/localStorage.utils';

export type AuthState = {
  userId: string;
  username: string;
  password: string;
  roles: string[];
  accessToken: string | null;
  refreshToken: string | null;
};

export const initialState: AuthState = {
  userId: '',
  username: '',
  password: '',
  roles: [],
  accessToken: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeLoginInfo: (state, action: PayloadAction<{ key: keyof AuthState; value: string }>) => {
      // @ts-ignore
      state[action.payload.key] = action.payload.value;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      setLocalStorageItem(LocalStorageKey.accessToken, action.payload);
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      setLocalStorageItem(LocalStorageKey.refreshToken, action.payload);
    },
    reset: (state) => {
      state = initialState;
      removeLocalStorageItem(LocalStorageKey.accessToken);
      removeLocalStorageItem(LocalStorageKey.refreshToken);
      return state;
    },
  },
});

export const {
  setUserId,
  setUsername,
  setRoles,
  setPassword,
  setAccessToken,
  setRefreshToken,
  reset,
} = authSlice.actions;
export default authSlice.reducer;
