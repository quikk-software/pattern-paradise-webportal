import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@/lib/redux/rootReducer';
import { CommonState, initialState as commonInitialState } from '@/lib/features/common/commonSlice';
import { AuthState, initialState as authInitialState } from '@/lib/features/auth/authSlice';

export type Store = {
  common: CommonState;
  auth: AuthState;
};

const initialStore: Store = {
  common: commonInitialState,
  auth: authInitialState,
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialStore,
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
