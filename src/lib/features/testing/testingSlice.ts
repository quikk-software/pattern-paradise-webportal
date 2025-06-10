import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetUserAccountResponse } from '@/@types/api-types';

export interface TestingState {
  selectedApplicants: { [key: string]: GetUserAccountResponse };
  applicationSelectionTestingId: string | null;
}

export const initialState: TestingState = {
  selectedApplicants: {},
  applicationSelectionTestingId: null,
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
    setApplicationSelectionTestingId: (state, action: PayloadAction<string | null>) => {
      state.applicationSelectionTestingId = action.payload;
    },
  },
});

export const {
  addSelectedApplicant,
  removeSelectedApplicant,
  resetSelectedApplicants,
  setApplicationSelectionTestingId,
} = testingSlice.actions;
export default testingSlice.reducer;
