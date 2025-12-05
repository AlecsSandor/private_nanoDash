import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hideAuthBanner } from "../../store/features/authBanner/authBannerSlice";
import classes from "./styles.module.scss";
import Button from "../SimpleButton";

const AuthBanner = () => {
  const dispatch = useAppDispatch();
  const { visible, message } = useAppSelector((state) => state.authBanner);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Close banner on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        dispatch(hideAuthBanner());
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount or visibility change
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, dispatch]);

  if (!visible) return null;

  return (
    <div className={classes.AuthBanner} ref={bannerRef}>
      <div className={classes.closeWrapper}>
        <button
          className={classes.closeButton}
          onClick={() => dispatch(hideAuthBanner())}
          aria-label="Close banner"
        >
          ×
        </button>
      </div>
      <span className={classes.message}>{message}</span>
      <div className={classes.actions}>
        <Button
          title="Sign In"
          variant="secondary"
          onClick={() => {
            window.location.href = "/signin";
          }}
        />
        <Button
          title="Sign Up"
          onClick={() => {
            window.location.href = "/register";
          }}
        />
      </div>
    </div>
  );
};

export default AuthBanner;
