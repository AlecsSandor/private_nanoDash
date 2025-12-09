import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  pointCount?: number;
  maxValue?: number;
  lineColor?: string;
  showDots?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  values = [],
  pointCount = 12,
  maxValue,
  lineColor = "hsl(64, 85%, 59%)",
  showDots = true,
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

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div className={styles.container} role="img" aria-label="line chart" {...props}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
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
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? styles.animatePath : ""}
          vectorEffect="non-scaling-stroke"
        />
        {showDots &&
          points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={lineColor}
              className={styles.dot}
              vectorEffect="non-scaling-stroke"
            >
              <title>{Math.round(p.value)}</title>
            </circle>
          ))}
      </svg>
    </div>
  );
};

export default LineChart;
