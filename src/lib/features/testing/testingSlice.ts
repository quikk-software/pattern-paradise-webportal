import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetUserAccountResponse } from '@/@types/api-types';

export interface TestingState {
  selectedApplicants: { [key: string]: GetUserAccountResponse }; // Use a plain object instead of Map
}

export const initialState: TestingState = {
  selectedApplicants: {},
};

export const testingSlice = createSlice({
  name: 'testing',
  initialState,
  reducers: {
    addSelectedApplicant: (state, action: PayloadAction<GetUserAccountResponse>) => {
      state.selectedApplicants[action.payload.id] = action.payload;
    },
    removeSelectedApplicant: (state, action: PayloadAction<GetUserAccountResponse>) => {
      delete state.selectedApplicants[action.payload.id];
    },
    resetSelectedApplicants: (state) => {
      state.selectedApplicants = {};
    },
  },
});

export const { addSelectedApplicant, removeSelectedApplicant, resetSelectedApplicants } =
  testingSlice.actions;
export default testingSlice.reducer;
