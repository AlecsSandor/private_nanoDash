// import React, { useMemo } from "react";
// import styles from "./styles.module.scss";

// export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
//   values?: number[];
//   barCount?: number;
//   maxHeight?: number;
//   barColor?: string;
//   animate?: boolean;
// }

// const BarChart: React.FC<BarChartProps> = ({
//   values = [],
//   barCount = 8,
//   maxHeight = 100,
//   barColor = "hsl(64, 85%, 59%)",
//   animate = true,
//   ...props
// }) => {
//   const computedValues = useMemo(() => {
//     return values.length
//       ? values.slice(0, barCount)
//       : Array.from({ length: barCount }, () => Math.random() * maxHeight);
//   }, [values, barCount, maxHeight]);

//   const highest = Math.max(...computedValues, 1);

//   return (
//     <div className={styles.container} role="img" aria-label="bar chart" {...props}>
//       <div className={styles.bars}>
//         {computedValues.map((v, i) => (
//           <div
//             key={i}
//             className={`${styles.bar} ${animate ? styles.animate : ""}`}
//             style={{
//               height: `${(v / highest) * 100}%`,
//               backgroundColor: barColor,
//               animationDelay: animate ? `${i * 30}ms` : undefined,
//             }}
//             title={`${Math.round((v / highest) * 100)}%`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BarChart;


import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  values?: number[];
  barCount?: number;
  maxHeight?: number; // now only used for fallback random values
  barColor?: string;
  animate?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  values = [],
  barCount = 8,
  maxHeight = 100,
  barColor = "hsl(64, 85%, 59%)",
  animate = true,
  ...props
}) => {
  const computedValues = useMemo(() => {
    return values.length
      ? values.slice(0, barCount)
      : Array.from({ length: barCount }, () => Math.random() * maxHeight);
  }, [values, barCount, maxHeight]);

  const { min, max } = useMemo(() => {
    if (!computedValues.length) {
      return { min: 0, max: 1 };
    }

    const min = Math.min(...computedValues);
    const max = Math.max(...computedValues);

    // prevent divide-by-zero when all values are the same
    if (min === max) {
      return { min: 0, max: max || 1 };
    }

    return { min, max };
  }, [computedValues]);

  return (
    <div
      className={styles.container}
      role="img"
      aria-label="bar chart"
      {...props}
    >
      <div className={styles.bars}>
        {computedValues.map((v, i) => {
  const normalized = (v - min) / (max - min);

  return (
    <div
      key={i}
      className={styles.bar}
      style={{
        height: `${normalized * 100}%`,
        backgroundColor: barColor,
        transition: animate
          ? "height 400ms cubic-bezier(0.4, 0, 0.2, 1)"
          : undefined,
        transitionDelay: animate ? `${i * 30}ms` : undefined,
      }}
      title={`${Math.round(normalized * 100)}%`}
    />
  );
})}
      </div>
    </div>
  );
};

export default BarChart;
