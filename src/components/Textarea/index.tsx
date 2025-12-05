import React from "react";
import classes from "./styles.module.scss";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => {
  return (
    <div className={classes.container}>
      {label && <label className={classes.label}>{label}</label>}
      <textarea
        {...props}
        className={`${classes.textarea} ${error ? classes.error : ""}`}
      />
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default TextArea;
