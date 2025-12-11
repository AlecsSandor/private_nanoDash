import React from "react";
import classes from "./styles.module.scss";

export interface WaveformStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string;
  change?: number;
  subtitle?: string;
  values?: number[];
  barCount?: number;
  accentColor?: string;
  /** Style variant: 'default' | 'gradient' | 'neon' */
  variant?: "default" | "gradient" | "neon";
  /** Shape of bars: 'rounded' | 'sharp' | 'pill' */
  barShape?: "rounded" | "sharp" | "pill";
  /** Size preset: 'sm' | 'md' | 'lg' */
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const WaveformStatCard: React.FC<WaveformStatCardProps> = ({
  title = "Sales Report",
  value = "$9,134",
  change = 2.5,
  subtitle = "Avg. score $185,301",
  values = [],
  barCount = 24,
  accentColor = "hsl(150, 60%, 45%)",
  variant = "default",
  barShape = "rounded",
  size = "md",
  animate = true,
  className,
  ...props
}) => {
  const computedValues = values.length
    ? values.slice(0, barCount)
    : Array.from({ length: barCount }, () => 0.2 + Math.random() * 0.8);

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
    neon: classes.variantNeon,
  };

  const shapeClasses = {
    rounded: classes.shapeRounded,
    sharp: classes.shapeSharp,
    pill: classes.shapePill,
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
        {computedValues.map((v, i) => {
          const height = (v / highest) * 100;
          return (
            <div
              key={i}
              className={`${classes.barWrapper} ${animate ? classes.animate : ""}`}
              style={{ animationDelay: `${i * 20}ms` }}
            >
              <div
                className={`${classes.bar} ${shapeClasses[barShape]}`}
                style={{
                  height: `${height}%`,
                  backgroundColor: variant === "gradient" 
                    ? undefined 
                    : accentColor,
                  backgroundImage: variant === "gradient"
                    ? `linear-gradient(to top, ${accentColor}, hsl(150, 80%, 65%))`
                    : undefined,
                  boxShadow: variant === "neon" 
                    ? `0 0 8px ${accentColor}, 0 0 12px ${accentColor}` 
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaveformStatCard;
