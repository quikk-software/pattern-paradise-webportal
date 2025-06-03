import { combineReducers, Reducer } from 'redux';
import { Store } from '@/lib/redux/store';
import commonReducer from '@/lib/features/common/commonSlice';
import authReducer from '@/lib/features/auth/authSlice';
import testingReducer from '@/lib/features/testing/testingSlice';
import analyticsReducer from '@/lib/features/analytics/analyticsSlice';
import filterReducer from '@/lib/features/filter/filterSlice';
import i18nReducer from '@/lib/features/i18n/i18nSlice';
import { enableMapSet } from 'immer';

enableMapSet();

export const rootReducer: Reducer<Store> = combineReducers({
  common: commonReducer,
  auth: authReducer,
  testing: testingReducer,
  analytics: analyticsReducer,
  filter: filterReducer,
  i18n: i18nReducer,
});
