import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  colors?: string[];
  animate?: boolean;
}

const defaultColors = [
  "hsl(64, 85%, 59%)",
  "hsl(180, 70%, 50%)",
  "hsl(280, 70%, 60%)",
  "hsl(340, 70%, 55%)",
  "hsl(30, 80%, 55%)",
];

const PieChart: React.FC<PieChartProps> = ({
  values = [],
  colors = defaultColors,
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values
      : Array.from({ length: 5 }, () => Math.random() * 40 + 10);
  }, [values]);

  const total = computedValues.reduce((a, b) => a + b, 0);

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

  const createArcPath = (startAngle: number, angle: number, radius: number) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((startAngle + angle - 90) * Math.PI) / 180;
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={styles.container} role="img" aria-label="pie chart" {...props}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        {segments.map((seg, i) => (
          <path
            key={i}
            d={createArcPath(seg.startAngle, seg.angle, 45)}
            fill={seg.color}
            className={`${styles.segment} ${animate ? styles.animate : ""}`}
            style={{ animationDelay: animate ? `${i * 100}ms` : undefined }}
          >
            <title>{`${Math.round(seg.percentage)}%`}</title>
          </path>
        ))}
      </svg>
    </div>
  );
};

export default PieChart;
