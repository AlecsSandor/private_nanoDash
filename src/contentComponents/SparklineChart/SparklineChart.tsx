import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface SparklineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  pointCount?: number;
  lineColor?: string;
  showArea?: boolean;
  animate?: boolean;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  values = [],
  pointCount = 20,
  lineColor = "hsl(64, 85%, 59%)",
  showArea = true,
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, pointCount)
      : Array.from({ length: pointCount }, () => Math.random() * 100);
  }, [values, pointCount]);

  const highest = Math.max(...computedValues, 1);
  const lowest = Math.min(...computedValues);
  const range = highest - lowest || 1;
  const padding = 2;

  const points = useMemo(() => {
    return computedValues.map((v, i) => ({
      x: padding + (i / (computedValues.length - 1)) * (100 - padding * 2),
      y: 100 - padding - ((v - lowest) / range) * (100 - padding * 2),
    }));
  }, [computedValues, lowest, range]);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`;

  return (
    <div className={styles.container} role="img" aria-label="sparkline chart" {...props}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        {showArea && (
          <path
            d={areaPath}
            fill={lineColor}
            fillOpacity="0.15"
            className={animate ? styles.animateArea : ""}
          />
        )}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className={animate ? styles.animateLine : ""}
        />
      </svg>
    </div>
  );
};

export default SparklineChart;
