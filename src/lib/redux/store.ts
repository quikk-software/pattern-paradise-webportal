import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@/lib/redux/rootReducer';
import { CommonState, initialState as commonInitialState } from '@/lib/features/common/commonSlice';
import { AuthState, initialState as authInitialState } from '@/lib/features/auth/authSlice';
import {
  TestingState,
  initialState as testingInitialState,
} from '@/lib/features/testing/testingSlice';
import {
  AnalyticsState,
  initialState as analyticsInitialState,
} from '@/lib/features/analytics/analyticsSlice';
import { FilterState, initialState as filterInitialState } from '@/lib/features/filter/filterSlice';
import { I18nState, initialState as i18nInitialState } from '@/lib/features/i18n/i18nSlice';

export type Store = {
  common: CommonState;
  auth: AuthState;
  testing: TestingState;
  analytics: AnalyticsState;
  filter: FilterState;
  i18n: I18nState;
};

const initialStore: Store = {
  common: commonInitialState,
  auth: authInitialState,
  testing: testingInitialState,
  analytics: analyticsInitialState,
  filter: filterInitialState,
  i18n: i18nInitialState,
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
