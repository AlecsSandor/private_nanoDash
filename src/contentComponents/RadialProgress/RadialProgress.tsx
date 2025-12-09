import React from "react";
import styles from "./styles.module.scss";

export interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  animate?: boolean;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  value = 75,
  maxValue = 100,
  strokeWidth = 8,
  color = "hsl(64, 85%, 59%)",
  trackColor = "hsl(0, 0%, 20%)",
  showValue = true,
  animate = true,
  ...props
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.container} role="img" aria-label="radial progress" {...props}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          className={animate ? styles.animate : ""}
          style={{
            "--offset": offset,
            "--circumference": circumference,
          } as React.CSSProperties}
          transform="rotate(-90 50 50)"
        />
        {showValue && (
          <text x="50" y="50" textAnchor="middle" dy="0.35em" className={styles.valueText}>
            {Math.round(percentage)}%
          </text>
        )}
      </svg>
    </div>
  );
};

export default RadialProgress;
