import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface ScatterPoint {
  x: number;
  y: number;
}

export interface ScatterPlotProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: ScatterPoint[];
  pointCount?: number;
  pointColor?: string;
  showGrid?: boolean;
  animate?: boolean;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  pointCount = 30,
  pointColor = "hsl(64, 85%, 59%)",
  showGrid = true,
  animate = true,
  ...props
}) => {
  const computedData = useMemo(() => {
    if (data?.length) return data;
    return Array.from({ length: pointCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
  }, [data, pointCount]);

  const padding = 15;

  const scaledPoints = useMemo(() => {
    const maxX = Math.max(...computedData.map((d) => d.x), 1);
    const maxY = Math.max(...computedData.map((d) => d.y), 1);
    return computedData.map((d) => ({
      x: padding + (d.x / maxX) * (100 - padding * 2),
      y: 100 - padding - (d.y / maxY) * (100 - padding * 2),
      originalX: d.x,
      originalY: d.y,
    }));
  }, [computedData]);

  return (
    <div className={styles.container} role="img" aria-label="scatter plot" {...props}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className={styles.svg}>
        {showGrid && (
          <g className={styles.grid}>
            {[0, 25, 50, 75, 100].map((v) => (
              <React.Fragment key={v}>
                <line
                  x1={padding}
                  y1={padding + (v / 100) * (100 - padding * 2)}
                  x2={100 - padding}
                  y2={padding + (v / 100) * (100 - padding * 2)}
                />
                <line
                  x1={padding + (v / 100) * (100 - padding * 2)}
                  y1={padding}
                  x2={padding + (v / 100) * (100 - padding * 2)}
                  y2={100 - padding}
                />
              </React.Fragment>
            ))}
          </g>
        )}
        {scaledPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill={pointColor}
            className={`${styles.point} ${animate ? styles.animate : ""}`}
            style={{ animationDelay: animate ? `${i * 20}ms` : undefined }}
          >
            <title>{`(${Math.round(p.originalX)}, ${Math.round(p.originalY)})`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default ScatterPlot;
