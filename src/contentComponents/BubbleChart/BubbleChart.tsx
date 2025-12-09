import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface BubbleData {
  x: number;
  y: number;
  size: number;
}

export interface BubbleChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: BubbleData[];
  bubbleCount?: number;
  color?: string;
  showGrid?: boolean;
  animate?: boolean;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  bubbleCount = 15,
  color = "hsl(64, 85%, 59%)",
  showGrid = true,
  animate = true,
  ...props
}) => {
  const computedData = useMemo(() => {
    if (data?.length) return data;
    return Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
    }));
  }, [data, bubbleCount]);

  const padding = 15;

  const scaledBubbles = useMemo(() => {
    const maxX = Math.max(...computedData.map((d) => d.x), 1);
    const maxY = Math.max(...computedData.map((d) => d.y), 1);
    const maxSize = Math.max(...computedData.map((d) => d.size), 1);
    return computedData.map((d) => ({
      x: padding + (d.x / maxX) * (100 - padding * 2),
      y: 100 - padding - (d.y / maxY) * (100 - padding * 2),
      r: 2 + (d.size / maxSize) * 6,
      originalSize: d.size,
    }));
  }, [computedData]);

  return (
    <div className={styles.container} role="img" aria-label="bubble chart" {...props}>
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
        {scaledBubbles.map((b, i) => (
          <circle
            key={i}
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={color}
            fillOpacity="0.6"
            stroke={color}
            strokeWidth="1"
            className={`${styles.bubble} ${animate ? styles.animate : ""}`}
            style={{ animationDelay: animate ? `${i * 40}ms` : undefined }}
          >
            <title>{`Size: ${Math.round(b.originalSize)}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default BubbleChart;
