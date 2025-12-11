import React from "react";
import classes from "./styles.module.scss";

export interface SummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Day abbreviation like "Fri", "Mon" */
  dayLabel?: string;
  /** Full date string */
  date?: string;
  /** Main content text - supports React nodes for rich content */
  content?: React.ReactNode;
  /** Show indicator dot next to day */
  showIndicator?: boolean;
  /** Indicator color */
  indicatorColor?: string;
  /** Style variant */
  variant?: "default" | "gradient" | "glass";
  /** Corner style */
  cornerStyle?: "rounded" | "sharp" | "pill";
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Max height before scrolling */
  maxHeight?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  dayLabel = "Fri",
  date = "January 17 2024",
  content = "Good morning! You have a productive day ahead.",
  showIndicator = true,
  indicatorColor = "hsl(0, 70%, 50%)",
  variant = "default",
  cornerStyle = "rounded",
  size = "md",
  maxHeight = 200,
  className,
  ...props
}) => {
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

  return (
    <div
      className={`${classes.container} ${variantClasses[variant]} ${cornerClasses[cornerStyle]} ${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      <div className={classes.header}>
        <div className={classes.dayWrapper}>
          <span className={classes.dayLabel}>{dayLabel}</span>
          {showIndicator && (
            <span
              className={classes.indicator}
              style={{ backgroundColor: indicatorColor }}
            />
          )}
        </div>
        <span className={classes.date}>{date}</span>
      </div>
      <div
        className={classes.content}
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {content}
      </div>
    </div>
  );
};

export default SummaryCard;
