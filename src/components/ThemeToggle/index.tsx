import React from "react";
import classes from "./styles.module.scss";

interface ThemeToggleProps {
  label?: string;
  error?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  label,
  error,
  checked = false,
  onChange,
  disabled = false,
  isMobile = false,
}) => {
  return (
    <div className={classes.container}>
      {/* {label && <label className={classes.label}>{label}</label>} */}
      <label className={`${classes.switch} ${isMobile ? classes.mobile : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={classes.input}
        />
        <span className={`${classes.slider} ${isMobile ? classes.mobile : ""}`}></span>
      </label>
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default ThemeToggle;
