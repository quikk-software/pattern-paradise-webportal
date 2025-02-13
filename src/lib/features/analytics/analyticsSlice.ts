import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type AnalyticsState = {
  startDate?: Date;
  endDate?: Date;
};

export const initialState: AnalyticsState = {};

export const authSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<Date | undefined>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<Date | undefined>) => {
      state.endDate = action.payload;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setStartDate, setEndDate, reset } = authSlice.actions;
export default authSlice.reducer;
