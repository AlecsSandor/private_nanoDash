import { StrictMode } from "react";
import { store } from "./store/store.ts";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from './App';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);