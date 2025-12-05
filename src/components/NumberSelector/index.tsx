import React from "react";
import classes from "./styles.module.scss";
import clsx from "clsx";

export interface NumberSelectorProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  const increase = () => {
    if (!disabled && value + step <= max) onChange(value + step);
  };

  const decrease = () => {
    if (!disabled && value - step >= min) onChange(value - step);
  };

  return (
    <div className={clsx(classes.numberSelectorWrapper, className, { [classes.disabled]: disabled })}>
      {label && <span className={classes.label}>{label}</span>}

      <div className={classes.controls}>
        <button
          type="button"
          className={classes.controlButton}
          onClick={decrease}
          disabled={disabled || value <= min}
        >
          –
        </button>

        <input
          type="number"
          className={classes.input}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />

        <button
          type="button"
          className={classes.controlButton}
          onClick={increase}
          disabled={disabled || value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumberSelector;