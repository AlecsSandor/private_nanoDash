import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface ColumnChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  labels?: string[];
  barCount?: number;
  barColor?: string;
  showLabels?: boolean;
  animate?: boolean;
}

const ColumnChart: React.FC<ColumnChartProps> = ({
  values = [],
  labels = [],
  barCount = 7,
  barColor = "hsl(64, 85%, 59%)",
  showLabels = true,
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, barCount)
      : Array.from({ length: barCount }, () => Math.random() * 100);
  }, [values, barCount]);

  const highest = Math.max(...computedValues, 1);

  const defaultLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className={styles.container} role="img" aria-label="column chart" {...props}>
      <div className={styles.chartArea}>
        <div className={styles.bars}>
          {computedValues.map((v, i) => (
            <div key={i} className={styles.column}>
              <div className={styles.barContainer}>
                <div
                  className={`${styles.bar} ${animate ? styles.animate : ""}`}
                  style={{
                    height: `${(v / highest) * 100}%`,
                    backgroundColor: barColor,
                    animationDelay: animate ? `${i * 50}ms` : undefined,
                  }}
                  title={`${Math.round(v)}`}
                />
              </div>
              {showLabels && (
                <span className={styles.label}>
                  {labels[i] || defaultLabels[i] || `${i + 1}`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
