import React from "react";
import styles from "./styles.module.scss";

export interface GaugeChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  minValue?: number;
  maxValue?: number;
  colors?: string[];
  label?: string;
  animate?: boolean;
}

const defaultColors = [
  "hsl(0, 70%, 55%)",
  "hsl(40, 80%, 55%)",
  "hsl(64, 85%, 59%)",
];

const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 65,
  minValue = 0,
  maxValue = 100,
  colors = defaultColors,
  label,
  animate = true,
  ...props
}) => {
  const percentage = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
  const angle = percentage * 180 - 90;

  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 50 + radius * Math.cos(startRad);
    const y1 = 50 + radius * Math.sin(startRad);
    const x2 = 50 + radius * Math.cos(endRad);
    const y2 = 50 + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const segmentAngle = 180 / colors.length;

  return (
    <div className={styles.container} role="img" aria-label="gauge chart" {...props}>
      <svg viewBox="0 0 100 60" className={styles.svg}>
        {colors.map((color, i) => (
          <path
            key={i}
            d={createArc(180 + i * segmentAngle, 180 + (i + 1) * segmentAngle, 40)}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="18"
          stroke="hsl(0, 0%, 95%)"
          strokeWidth="2"
          strokeLinecap="round"
          className={animate ? styles.needle : ""}
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: "50px 50px",
            "--target-angle": `${angle}deg`,
          } as React.CSSProperties}
        />
        <circle cx="50" cy="50" r="4" fill="hsl(0, 0%, 95%)" />
        <text x="50" y="55" textAnchor="middle" className={styles.valueText}>
          {Math.round(value)}
        </text>
        {label && (
          <text x="50" y="65" textAnchor="middle" className={styles.label}>
            {label}
          </text>
        )}
      </svg>
    </div>
  );
};

export default GaugeChart;
