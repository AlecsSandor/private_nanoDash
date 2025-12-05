import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isMobileNavOpen: boolean;
  isBasketOpen: boolean | null;
  theme: "light" | "dark";
  language: string;
  modal: {
    isOpen: boolean;
    type: string | null;
  };
  page: string;
  tab: string;
}

const initialState: UIState = {
  isSidebarOpen: false,
  isSearchOpen: false,
  isMobileNavOpen: false,
  isBasketOpen: false,
  theme: "light",
  language: localStorage.getItem("ui.language") || "en",
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
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearch(state) {
      // close other modals
      state.isMobileNavOpen = false;
      state.isBasketOpen = false;
      state.isSearchOpen = !state.isSearchOpen;
    },
    toggleMobileNav(state) {
      // close other modals
      state.isSearchOpen = false;
      state.isBasketOpen = false;
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    toggleBasket(state) {
      // close other modals
      state.isSearchOpen = false;
      state.isMobileNavOpen = false;
      state.isBasketOpen = !state.isBasketOpen;
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
  },
});

export const {
  toggleSidebar,
  toggleSearch,
  toggleMobileNav,
  toggleBasket,
  setTheme,
  setLanguage,
  setPage,
  setTab,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
