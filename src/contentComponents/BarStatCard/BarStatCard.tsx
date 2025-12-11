import React from "react";
import classes from "./styles.module.scss";

export interface BarStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string;
  change?: number;
  subtitle?: string;
  values?: number[];
  barCount?: number;
  accentColor?: string;
  /** Style variant: 'default' | 'gradient' | 'striped' */
  variant?: "default" | "gradient" | "striped";
  /** Shape of bars: 'rounded' | 'sharp' | 'notched' */
  barShape?: "rounded" | "sharp" | "notched";
  /** Size preset: 'sm' | 'md' | 'lg' */
  size?: "sm" | "md" | "lg";
  /** Layout: 'horizontal' places chart on the right, 'vertical' places chart below */
  layout?: "horizontal" | "vertical";
  animate?: boolean;
}

const BarStatCard: React.FC<BarStatCardProps> = ({
  title = "Sales Report",
  value = "$9,134",
  change = 2.5,
  subtitle = "Avg. score $185,301",
  values = [],
  barCount = 12,
  accentColor = "hsl(80, 70%, 50%)",
  variant = "default",
  barShape = "rounded",
  size = "md",
  layout = "vertical",
  animate = true,
  className,
  ...props
}) => {
  const computedValues = values.length
    ? values.slice(0, barCount)
    : Array.from({ length: barCount }, () => 0.3 + Math.random() * 0.7);

  const highest = Math.max(...computedValues, 1);
  const isPositive = change >= 0;

  const sizeClasses = {
    sm: classes.sizeSm,
    md: classes.sizeMd,
    lg: classes.sizeLg,
  };

  const variantClasses = {
    default: classes.variantDefault,
    gradient: classes.variantGradient,
    striped: classes.variantStriped,
  };

  const shapeClasses = {
    rounded: classes.shapeRounded,
    sharp: classes.shapeSharp,
    notched: classes.shapeNotched,
  };

  const layoutClasses = {
    horizontal: classes.layoutHorizontal,
    vertical: classes.layoutVertical,
  };

  return (
    <div
      className={`${classes.container} ${sizeClasses[size]} ${variantClasses[variant]} ${layoutClasses[layout]} ${className || ""}`}
      {...props}
    >
      <div className={classes.chart}>
        {computedValues.map((v, i) => {
          const height = (v / highest) * 100;
          return (
            <div
              key={i}
              className={`${classes.barWrapper} ${animate ? classes.animate : ""}`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div
                className={`${classes.bar} ${shapeClasses[barShape]}`}
                style={{
                  height: `${height}%`,
                  backgroundColor: variant === "gradient" ? undefined : accentColor,
                  backgroundImage: variant === "gradient"
                    ? `linear-gradient(to top, hsl(60, 70%, 45%), ${accentColor})`
                    : variant === "striped"
                    ? `repeating-linear-gradient(0deg, ${accentColor}, ${accentColor} 3px, transparent 3px, transparent 5px)`
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
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
    </div>
  );
};

export default BarStatCard;
