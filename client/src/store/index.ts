import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import projectSlice from './slices/projectSlice';
import editorSlice from './slices/editorSlice';
import uiSlice from './slices/uiSlice';
import assetsSlice from './slices/assetsSlice';

// Persist config
const persistConfig = {
  key: 'gamecraft-root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  project: projectSlice,
  editor: editorSlice,
  ui: uiSlice,
  assets: assetsSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;