import React from "react";
import classes from "./styles.module.scss";

export interface SummaryTableProps<T extends Record<string, any>>
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of objects to render */
  data: T[];
  /** Max number of rows to display */
  limit?: number;
  /** Style variant */
  variant?: "default" | "gradient" | "glass";
  /** Corner style */
  cornerStyle?: "rounded" | "sharp" | "pill";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Hide table header */
  hideHeader?: boolean;
}

const SummaryTable = <T extends Record<string, any>>({
  data,
  limit,
  variant = "default",
  cornerStyle = "rounded",
  size = "md",
  hideHeader = false,
  className,
  ...props
}: SummaryTableProps<T>) => {
  const variantClasses = {
    default: classes.variantDefault,
    gradient: classes.variantGradient,
    glass: classes.variantGlass,
  };

  const cornerClasses = {
    rounded: classes.cornerRounded,
    sharp: classes.cornerSharp,
    pill: classes.cornerPill,
  };

  const sizeClasses = {
    sm: classes.sizeSm,
    md: classes.sizeMd,
    lg: classes.sizeLg,
  };

  const rows = limit ? data.slice(0, limit) : data;
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div
      className={`${classes.container} ${variantClasses[variant]} ${cornerClasses[cornerStyle]} ${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      <table className={classes.table}>
        {!hideHeader && (
          <thead>
            <tr>
              {headers.map((key, index) => (
                <th key={index}>{key || ""}</th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((key, cellIndex) => (
                <td key={cellIndex}>
                  {row[key] !== undefined && row[key] !== null
                    ? String(row[key])
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
