import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface CandlestickData {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: CandlestickData[];
  candleCount?: number;
  upColor?: string;
  downColor?: string;
  animate?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  candleCount = 20,
  upColor = "hsl(140, 70%, 45%)",
  downColor = "hsl(0, 70%, 50%)",
  animate = true,
  ...props
}) => {
  const computedData = useMemo(() => {
    if (data?.length) return data.slice(0, candleCount);
    let lastClose = 50;
    return Array.from({ length: candleCount }, () => {
      const open = lastClose;
      const change = (Math.random() - 0.5) * 15;
      const close = Math.max(10, Math.min(90, open + change));
      const high = Math.max(open, close) + Math.random() * 8;
      const low = Math.min(open, close) - Math.random() * 8;
      lastClose = close;
      return { open, high, low, close };
    });
  }, [data, candleCount]);

  const allValues = computedData.flatMap((d) => [d.high, d.low]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;
  const padding = 10;

  const scaleY = (value: number) =>
    padding + ((maxValue - value) / range) * (100 - padding * 2);

  const candleWidth = (100 - padding * 2) / computedData.length;

  return (
    <div className={styles.container} role="img" aria-label="candlestick chart" {...props}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        {computedData.map((candle, i) => {
          const isUp = candle.close >= candle.open;
          const x = padding + i * candleWidth + candleWidth / 2;
          const bodyTop = scaleY(Math.max(candle.open, candle.close));
          const bodyBottom = scaleY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          return (
            <g
              key={i}
              className={`${styles.candle} ${animate ? styles.animate : ""}`}
              style={{ animationDelay: animate ? `${i * 30}ms` : undefined }}
            >
              {/* Wick */}
              <line
                x1={x}
                y1={scaleY(candle.high)}
                x2={x}
                y2={scaleY(candle.low)}
                stroke={isUp ? upColor : downColor}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* Body */}
              <rect
                x={x - candleWidth * 0.35}
                y={bodyTop}
                width={candleWidth * 0.7}
                height={bodyHeight}
                fill={isUp ? upColor : downColor}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CandlestickChart;
