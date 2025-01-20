import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  userId: string;
  username: string;
  password: string;
  roles: string[];
};

export const initialState: AuthState = {
  userId: '',
  username: '',
  password: '',
  roles: [],
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
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setUserId, setUsername, setRoles, setPassword, reset } = authSlice.actions;
export default authSlice.reducer;
