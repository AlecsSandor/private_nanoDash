import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  labels?: string[];
  maxValue?: number;
  fillColor?: string;
  strokeColor?: string;
  animate?: boolean;
}

const RadarChart: React.FC<RadarChartProps> = ({
  values = [],
  labels = [],
  maxValue = 100,
  fillColor = "hsl(64, 85%, 59%)",
  strokeColor = "hsl(64, 85%, 59%)",
  animate = true,
  ...props
}) => {
  const defaultLabels = ["Speed", "Power", "Range", "Armor", "Magic", "Luck"];

  const computedValues = useMemo(() => {
    return values.length
      ? values
      : Array.from({ length: 6 }, () => Math.random() * maxValue);
  }, [values, maxValue]);

  const computedLabels = labels.length ? labels : defaultLabels;
  const sides = computedValues.length;
  const angleStep = (Math.PI * 2) / sides;
  const center = 50;
  const radius = 35;

  const getPoint = (value: number, index: number, r: number = radius) => {
    const angle = angleStep * index - Math.PI / 2;
    const normalizedValue = (value / maxValue) * r;
    return {
      x: center + normalizedValue * Math.cos(angle),
      y: center + normalizedValue * Math.sin(angle),
    };
  };

  const dataPoints = computedValues.map((v, i) => getPoint(v, i));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className={styles.container} role="img" aria-label="radar chart" {...props}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        {/* Grid */}
        <g className={styles.grid}>
          {gridLevels.map((level) => {
            const points = Array.from({ length: sides }, (_, i) => {
              const p = getPoint(maxValue * level, i);
              return `${p.x},${p.y}`;
            }).join(" ");
            return <polygon key={level} points={points} fill="none" stroke="hsl(0, 0%, 25%)" strokeWidth="0.5" />;
          })}
          {Array.from({ length: sides }, (_, i) => {
            const p = getPoint(maxValue, i);
            return (
              <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="hsl(0, 0%, 25%)" strokeWidth="0.5" />
            );
          })}
        </g>

        {/* Data */}
        <path
          d={dataPath}
          fill={fillColor}
          fillOpacity="0.3"
          stroke={strokeColor}
          strokeWidth="2"
          className={animate ? styles.animate : ""}
        />

        {/* Points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={strokeColor} className={styles.point}>
            <title>{`${computedLabels[i]}: ${Math.round(computedValues[i])}`}</title>
          </circle>
        ))}

        {/* Labels */}
        {computedLabels.map((label, i) => {
          const p = getPoint(maxValue + 15, i);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className={styles.label}>
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
