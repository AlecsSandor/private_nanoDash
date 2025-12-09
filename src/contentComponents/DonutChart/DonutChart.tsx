import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  colors?: string[];
  innerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
  animate?: boolean;
}

const defaultColors = [
  "hsl(64, 85%, 59%)",
  "hsl(180, 70%, 50%)",
  "hsl(280, 70%, 60%)",
  "hsl(340, 70%, 55%)",
  "hsl(30, 80%, 55%)",
];

const DonutChart: React.FC<DonutChartProps> = ({
  values = [],
  colors = defaultColors,
  innerRadius = 25,
  centerLabel,
  centerValue,
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values
      : Array.from({ length: 4 }, () => Math.random() * 40 + 10);
  }, [values]);

  const total = computedValues.reduce((a, b) => a + b, 0);
  const outerRadius = 45;

  const segments = useMemo(() => {
    let currentAngle = 0;
    return computedValues.map((v, i) => {
      const angle = (v / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return {
        value: v,
        percentage: (v / total) * 100,
        startAngle,
        angle,
        color: colors[i % colors.length],
      };
    });
  }, [computedValues, total, colors]);

  const createArcPath = (startAngle: number, angle: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((startAngle + angle - 90) * Math.PI) / 180;
    
    const x1Outer = 50 + outerRadius * Math.cos(startRad);
    const y1Outer = 50 + outerRadius * Math.sin(startRad);
    const x2Outer = 50 + outerRadius * Math.cos(endRad);
    const y2Outer = 50 + outerRadius * Math.sin(endRad);
    
    const x1Inner = 50 + innerRadius * Math.cos(endRad);
    const y1Inner = 50 + innerRadius * Math.sin(endRad);
    const x2Inner = 50 + innerRadius * Math.cos(startRad);
    const y2Inner = 50 + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M ${x1Outer} ${y1Outer} 
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} 
            L ${x1Inner} ${y1Inner} 
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x2Inner} ${y2Inner} Z`;
  };

  return (
    <div className={styles.container} role="img" aria-label="donut chart" {...props}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={createArcPath(seg.startAngle, seg.angle)}
            fill={seg.color}
            className={`${styles.segment} ${animate ? styles.animate : ""}`}
            style={{ animationDelay: animate ? `${i * 100}ms` : undefined }}
          >
            <title>{`${Math.round(seg.percentage)}%`}</title>
          </path>
        ))}
        {(centerLabel || centerValue) && (
          <g className={styles.centerText}>
            {centerValue && (
              <text x="50" y="52" textAnchor="middle" className={styles.centerValue}>
                {centerValue}
              </text>
            )}
            {centerLabel && (
              <text x="50" y="62" textAnchor="middle" className={styles.centerLabel}>
                {centerLabel}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

export default DonutChart;
