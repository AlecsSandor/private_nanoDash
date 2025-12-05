import React, { useState } from "react";
import classes from "./styles.module.scss";
import { validateEmail, validatePassword, validateUsername } from "../../utils";

export type InputRole = 'email' | 'password' | 'username' | 'none';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  value?: string;
  placeholder?: string;
  role?: InputRole;
  onValidationError?: (error: string | null) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = "",
  role = 'none',
  onValidationError,
  onChange,
  onBlur,
  value,
  ...props
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateInput = (inputValue: string) => {
    let validationResult: string | null = null;

    if (inputValue.trim() !== '') { // Only validate if there's actual input
      switch (role) {
        case 'email':
          validationResult = validateEmail(inputValue);
          break;
        case 'password':
          validationResult = validatePassword(inputValue);
          break;
        case 'username':
          validationResult = validateUsername(inputValue);
          break;
        default:
          validationResult = null;
      }
    }

    setValidationError(validationResult);
    onValidationError?.(validationResult);
    return validationResult;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    // Validate on each change if there's input
    if (role !== 'none') {
      validateInput(e.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    // Validate on blur
    if (role !== 'none') {
      validateInput(e.target.value);
    }
  };



  const displayError = error || validationError;

  return (
    <div className={`${classes.inputGroup} ${className}`}>
      {label && <label className={classes.label}>{label}</label>}
      <input
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${classes.input} ${displayError ? classes.errorInput : ""}`}
      />
      {displayError && <span className={classes.errorText}>{displayError}</span>}
    </div>
  );
};

export default InputField;
