import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export type AuthState = {
  userId: string;
  username: string;
  password: string;
  roles: string[];
  accessToken: string | null;
  refreshToken: string | null;
  checkAuthIsLoading: boolean;
};

export const initialState: AuthState = {
  userId: '',
  username: '',
  password: '',
  roles: [],
  accessToken: null,
  refreshToken: null,
  checkAuthIsLoading: false,
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
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    setCheckAuthIsLoading: (state, action: PayloadAction<boolean>) => {
      state.checkAuthIsLoading = action.payload;
    },
    reset: (state) => {
      state = initialState;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      return state;
    },
    logout: (state) => {
      state.password = '';
      state.userId = '';
      state.username = '';
      state.accessToken = null;
      state.refreshToken = null;
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
  setCheckAuthIsLoading,
  reset,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
