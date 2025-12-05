// src/store/features/auth/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AuthBannerState {
  visible: boolean;
  message: string;
}

const initialState: AuthBannerState = {
  visible: false,
  message: "Please sign in or create an account to continue.",
};

const authBannerSlice = createSlice({
  name: "authBanner",
  initialState,
  reducers: {
    showAuthBanner: (state, action) => {
      console.log("showing banner")
      state.visible = true;
      state.message =
        action.payload || "Please sign in or create an account to continue.";
    },
    hideAuthBanner: (state) => {
      state.visible = false;
    },
  },
});

export const { showAuthBanner, hideAuthBanner } = authBannerSlice.actions;
export default authBannerSlice.reducer;
