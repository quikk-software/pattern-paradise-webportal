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
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        Cookies.set('accessToken', action.payload);
      } else {
        Cookies.remove('accessToken');
      }
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        Cookies.set('refreshToken', action.payload);
      } else {
        Cookies.remove('refreshToken');
      }
      state.refreshToken = action.payload;
    },
    reset: (state) => {
      state = initialState;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
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
