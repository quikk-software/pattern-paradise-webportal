import { combineReducers, Reducer } from 'redux';
import { Store } from '@/lib/redux/store';
import commonReducer from '@/lib/features/common/commonSlice';
import authReducer from '@/lib/features/auth/authSlice';

export const rootReducer: Reducer<Store> = combineReducers({
  common: commonReducer,
  auth: authReducer,
});
