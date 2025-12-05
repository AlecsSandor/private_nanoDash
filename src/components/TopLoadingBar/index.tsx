// src/components/TopLoadingBar.tsx
import { useEffect } from "react";
import NProgress from "nprogress";
import classes from "./styles.module.scss";

interface TopLoadingBarProps {
  loading: boolean;
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ loading }) => {
  useEffect(() => {
    NProgress.configure({
      showSpinner: false,        // no spinner, just the top bar
      speed: 500,                // animation speed in ms
      minimum: 0.2,              // minimum percent to start from
      easing: "ease",            // CSS easing
    });

    if (loading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [loading]);

  return null;
};