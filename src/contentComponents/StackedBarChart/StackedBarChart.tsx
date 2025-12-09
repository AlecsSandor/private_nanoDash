import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface StackedBarData {
  values: number[];
  colors?: string[];
}

export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: StackedBarData[];
  barCount?: number;
  colors?: string[];
  animate?: boolean;
}

const defaultColors = [
  "hsl(64, 85%, 59%)",
  "hsl(180, 70%, 50%)",
  "hsl(280, 70%, 60%)",
  "hsl(340, 70%, 55%)",
];

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  barCount = 8,
  colors = defaultColors,
  animate = true,
  ...props
}) => {
  const computedData: StackedBarData[] = useMemo(() => {
    if (data?.length) return data;
    return Array.from({ length: barCount }, () => ({
      values: Array.from({ length: 3 }, () => Math.random() * 30 + 10),
    }));
  }, [data, barCount]);

  const maxTotal = Math.max(
    ...computedData.map((d) => d.values.reduce((a, b) => a + b, 0)),
    1
  );

  return (
    <div className={styles.container} role="img" aria-label="stacked bar chart" {...props}>
      <div className={styles.bars}>
        {computedData.map((bar, i) => {
          const total = bar.values.reduce((a, b) => a + b, 0);
          return (
            <div
              key={i}
              className={`${styles.barStack} ${animate ? styles.animate : ""}`}
              style={{
                height: `${(total / maxTotal) * 100}%`,
                animationDelay: animate ? `${i * 50}ms` : undefined,
              }}
            >
              {bar.values.map((v, j) => (
                <div
                  key={j}
                  className={styles.segment}
                  style={{
                    height: `${(v / total) * 100}%`,
                    backgroundColor: bar.colors?.[j] || colors[j % colors.length],
                  }}
                  title={`${Math.round(v)}`}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackedBarChart;
