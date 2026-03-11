import { configureStore } from '@reduxjs/toolkit';
import statementsReducer from './statementsSlice';

export const store = configureStore({
  reducer: {
    statements: statementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
