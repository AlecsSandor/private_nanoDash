import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationState {
  message: string;
  type: "success" | "error" | "info" | null;
  visible: boolean;
}

const initialState: NotificationState = {
  message: "",
  type: null,
  visible: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type: "success" | "error" | "info" }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },
    hideNotification: (state) => {
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;