import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  pointCount?: number;
  maxValue?: number;
  fillColor?: string;
  strokeColor?: string;
  showGrid?: boolean;
  animate?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  values = [],
  pointCount = 12,
  maxValue,
  fillColor = "hsl(64, 85%, 59%)",
  strokeColor = "hsl(64, 85%, 59%)",
  showGrid = true,
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, pointCount)
      : Array.from({ length: pointCount }, () => Math.random() * 100);
  }, [values, pointCount]);

  const highest = maxValue ?? Math.max(...computedValues, 1);
  const padding = 20;

  const points = useMemo(() => {
    return computedValues.map((v, i) => ({
      x: padding + (i / (computedValues.length - 1)) * (100 - padding * 2),
      y: 100 - padding - (v / highest) * (100 - padding * 2),
      value: v,
    }));
  }, [computedValues, highest]);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`;

  return (
    <div className={styles.container} role="img" aria-label="area chart" {...props}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {showGrid && (
          <g className={styles.grid}>
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1={padding}
                y1={padding + (y / 100) * (100 - padding * 2)}
                x2={100 - padding}
                y2={padding + (y / 100) * (100 - padding * 2)}
              />
            ))}
          </g>
        )}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          className={animate ? styles.animateArea : ""}
        />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default AreaChart;
