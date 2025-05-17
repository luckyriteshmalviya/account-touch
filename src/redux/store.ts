import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loaderReducer from './reducer/loaderReducer';
import authReducer from './reducer/authReducer';


const appReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    state = {}
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const GetRootState = store.getState;
(<any>window).getState = store.getState;
