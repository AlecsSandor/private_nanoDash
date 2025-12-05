import React, { useState } from "react";
import classes from "./styles.module.scss";

export interface SelectGroupProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ options, value, onChange }) => {
  const [selected, setSelected] = useState(value || "");

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
  };

  return (
    <div className={classes.selectGroup}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`${classes.optionButton} ${
            selected === option ? classes.selected : ""
          }`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SelectGroup;