import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface HorizontalBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  labels?: string[];
  barCount?: number;
  barColor?: string;
  animate?: boolean;
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  values = [],
  labels = [],
  barCount = 6,
  barColor = "hsl(64, 85%, 59%)",
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, barCount)
      : Array.from({ length: barCount }, () => Math.random() * 100);
  }, [values, barCount]);

  const highest = Math.max(...computedValues, 1);

  return (
    <div className={styles.container} role="img" aria-label="horizontal bar chart" {...props}>
      <div className={styles.bars}>
        {computedValues.map((v, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.label}>{labels[i] || `Item ${i + 1}`}</span>
            <div className={styles.barWrapper}>
              <div
                className={`${styles.bar} ${animate ? styles.animate : ""}`}
                style={{
                  width: `${(v / highest) * 100}%`,
                  backgroundColor: barColor,
                  animationDelay: animate ? `${i * 50}ms` : undefined,
                }}
                title={`${Math.round(v)}`}
              />
            </div>
            <span className={styles.value}>{Math.round(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
