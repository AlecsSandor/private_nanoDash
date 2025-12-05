import React from "react";
import classes from "./styles.module.scss";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, ...props }) => {
  return (
    <label className={classes.checkboxWrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={classes.checkboxInput}
        {...props}
      />
      <span className={classes.checkboxCustom} />
      {label && <span className={classes.checkboxLabel}>{label}</span>}
    </label>
  );
};

export default Checkbox;
