import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  barCount?: number;
  maxHeight?: number;
  barColor?: string;
  animate?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  values = [],
  barCount = 3,
  maxHeight = 100,
  barColor = "hsl(64, 85%, 59%)",
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, barCount)
      : Array.from({ length: barCount }, () => Math.random() * maxHeight);
  }, [values, barCount, maxHeight]);

  const highest = Math.max(...computedValues, 1);

  return (
    <div className={styles.container} role="img" aria-label="bar chart" {...props}>
      <div className={styles.bars}>
        {computedValues.map((v, i) => (
          <div
            key={i}
            className={`${styles.bar} ${animate ? styles.animate : ""}`}
            style={{
              height: `${(v / highest) * 100}%`,
              backgroundColor: barColor,
              animationDelay: animate ? `${i * 30}ms` : undefined,
            }}
            title={`${Math.round((v / highest) * 100)}%`}
          />
        ))}
      </div>
    </div>
  );
};

export default BarChart;
