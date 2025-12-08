// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import postsReducer from "./features/posts/postsSlice";
import notificationReducer from './features/notifications/notificationSlice';
import AuthBannerReducer from './features/authBanner/authBannerSlice'
import uiReducer from './features/ui/uiSlice';
import modulesReducer from './features/modules/modulesSlice';
//import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    notification: notificationReducer,
    authBanner: AuthBannerReducer,
    ui: uiReducer,
    modules: modulesReducer,
    //dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // if you put tokens in non-serializable places, adjust rules
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = typeof store.dispatch;
export default store;
