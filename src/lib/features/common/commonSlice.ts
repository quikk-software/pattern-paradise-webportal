import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  isLoading: boolean;
}

export const initialState: CommonState = {
  isLoading: false,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    toggleIsLoading: (state, _action: PayloadAction<boolean>) => {
      state.isLoading = !state.isLoading;
    },
  },
});

export const { toggleIsLoading } = commonSlice.actions;
export default commonSlice.reducer;
