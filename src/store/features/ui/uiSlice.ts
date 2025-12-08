import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  isMobileNavOpen: boolean;
  theme: "light" | "dark";
  language: string;

  // NEW
  selectedModuleId: string | null;
  isSidePanelOpen: boolean;

  modal: {
    isOpen: boolean;
    type: string | null;
  };
  page: string;
  tab: string;
}

const initialState: UIState = {
  isMobileNavOpen: false,
  theme: "dark",
  language: localStorage.getItem("ui.language") || "en",

  // NEW
  selectedModuleId: null,
  isSidePanelOpen: false,

  modal: {
    isOpen: false,
    type: null,
  },
  page: "index",
  tab: "details",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },

    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
    },

    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
      localStorage.setItem("ui.language", action.payload);
    },

    openModal(state, action: PayloadAction<string>) {
      state.modal.isOpen = true;
      state.modal.type = action.payload;
    },

    closeModal(state) {
      state.modal.isOpen = false;
      state.modal.type = null;
    },

    setPage(state, action) {
      state.page = action.payload;
    },

    setTab(state, action) {
      state.tab = action.payload;
    },

    // 🍀 NEW — MODULE SELECTION
    setSelectedModule(state, action: PayloadAction<string>) {
      state.selectedModuleId = action.payload;
    },

    deselectModule(state) {
      state.selectedModuleId = null;
      state.isSidePanelOpen = false;
    },

    // 🍀 NEW — SIDE PANEL
    openSidePanel(state) {
      state.isSidePanelOpen = true;
    },
    closeSidePanel(state) {
      state.isSidePanelOpen = false;
    },

  },
});

export const {
  toggleMobileNav,
  setTheme,
  setLanguage,
  setPage,
  setTab,
  openModal,
  closeModal,

  // NEW EXPORTS
  setSelectedModule,
  deselectModule,
  openSidePanel,
  closeSidePanel,
} = uiSlice.actions;

export default uiSlice.reducer;
