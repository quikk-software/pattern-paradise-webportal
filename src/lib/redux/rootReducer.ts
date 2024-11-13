import { combineReducers, Reducer } from 'redux';
import { Store } from '@/lib/redux/store';
import commonReducer from '@/lib/features/common/commonSlice';
import authReducer from '@/lib/features/auth/authSlice';
import testingReducer from '@/lib/features/testing/testingSlice';
import { enableMapSet } from 'immer';

enableMapSet();

export const rootReducer: Reducer<Store> = combineReducers({
  common: commonReducer,
  auth: authReducer,
  testing: testingReducer,
});
