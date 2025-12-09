import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: number[][];
  rows?: number;
  cols?: number;
  colors?: [string, string, string];
  animate?: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({
  data,
  rows = 7,
  cols = 12,
  colors = ["hsl(0, 0%, 15%)", "hsl(64, 60%, 40%)", "hsl(64, 85%, 59%)"],
  animate = true,
  ...props
}) => {
  const computedData = useMemo(() => {
    if (data?.length) return data;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 100)
    );
  }, [data, rows, cols]);

  const maxValue = Math.max(...computedData.flat(), 1);

  const interpolateColor = (value: number) => {
    const ratio = value / maxValue;
    if (ratio < 0.5) {
      return colors[0];
    } else if (ratio < 0.75) {
      return colors[1];
    }
    return colors[2];
  };

  return (
    <div className={styles.container} role="img" aria-label="heatmap" {...props}>
      <div className={styles.grid}>
        {computedData.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`${styles.cell} ${animate ? styles.animate : ""}`}
              style={{
                backgroundColor: interpolateColor(cell),
                opacity: 0.3 + (cell / maxValue) * 0.7,
                animationDelay: animate ? `${(i * cols + j) * 10}ms` : undefined,
              }}
              title={`${Math.round(cell)}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Heatmap;
