import React from "react";
import classes from "./styles.module.scss";

export interface SegmentedStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string;
  change?: number;
  subtitle?: string;
  /** Array of progress values (0-100) for each row */
  rows?: number[];
  segmentsPerRow?: number;
  accentColor?: string;
  inactiveColor?: string;
  /** Style variant: 'default' | 'gradient' | 'glow' */
  variant?: "default" | "gradient" | "glow";
  /** Shape of segments: 'rounded' | 'sharp' | 'circle' */
  segmentShape?: "rounded" | "sharp" | "circle";
  /** Size preset: 'sm' | 'md' | 'lg' */
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const SegmentedStatCard: React.FC<SegmentedStatCardProps> = ({
  title = "Sales Report",
  value = "$9,134",
  change = 2.5,
  subtitle = "Avg. score $185,301",
  rows = [80, 60, 40, 100],
  segmentsPerRow = 8,
  accentColor = "hsl(100, 70%, 50%)",
  inactiveColor = "hsl(0, 0%, 25%)",
  variant = "default",
  segmentShape = "rounded",
  size = "md",
  animate = true,
  className,
  ...props
}) => {
  const isPositive = change >= 0;

  const sizeClasses = {
    sm: classes.sizeSm,
    md: classes.sizeMd,
    lg: classes.sizeLg,
  };

  const variantClasses = {
    default: classes.variantDefault,
    gradient: classes.variantGradient,
    glow: classes.variantGlow,
  };

  const shapeClasses = {
    rounded: classes.shapeRounded,
    sharp: classes.shapeSharp,
    circle: classes.shapeCircle,
  };

  return (
    <div
      className={`${classes.container} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      <div className={classes.content}>
        <span className={classes.title}>{title}</span>
        <div className={classes.valueRow}>
          <span className={classes.value}>{value}</span>
          <span className={`${classes.change} ${isPositive ? classes.positive : classes.negative}`}>
            {isPositive ? "↑" : "↓"}{Math.abs(change)}%
          </span>
        </div>
        <span className={classes.subtitle}>{subtitle}</span>
      </div>
      <div className={classes.chart}>
        {rows.map((progress, rowIndex) => {
          const activeCount = Math.round((progress / 100) * segmentsPerRow);
          return (
            <div
              key={rowIndex}
              className={`${classes.row} ${animate ? classes.animate : ""}`}
              style={{ animationDelay: `${rowIndex * 100}ms` }}
            >
              {Array.from({ length: segmentsPerRow }).map((_, segIndex) => {
                const isActive = segIndex < activeCount;
                return (
                  <div
                    key={segIndex}
                    className={`${classes.segment} ${shapeClasses[segmentShape]} ${isActive ? classes.active : ""}`}
                    style={{
                      backgroundColor: isActive ? accentColor : inactiveColor,
                      backgroundImage: isActive && variant === "gradient"
                        ? `linear-gradient(90deg, ${accentColor}, hsl(120, 80%, 60%))`
                        : undefined,
                      boxShadow: isActive && variant === "glow"
                        ? `0 0 6px ${accentColor}`
                        : undefined,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedStatCard;
