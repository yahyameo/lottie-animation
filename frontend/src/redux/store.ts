import { configureStore, Middleware, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares: Middleware[] = getDefaultMiddleware({
      thunk: true, // Enable Redux Thunk middleware
    });
    return middlewares;
  },
});

export default store;
