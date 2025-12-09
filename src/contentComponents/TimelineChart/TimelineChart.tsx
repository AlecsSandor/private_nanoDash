import React, { useMemo } from "react";
import styles from "./styles.module.scss";

export interface TimelineEvent {
  label: string;
  date: string;
  color?: string;
}

export interface TimelineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: TimelineEvent[];
  lineColor?: string;
  dotColor?: string;
  animate?: boolean;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  events,
  lineColor = "hsl(0, 0%, 30%)",
  dotColor = "hsl(64, 85%, 59%)",
  animate = true,
  ...props
}) => {
  const computedEvents = useMemo(() => {
    if (events?.length) return events;
    return [
      { label: "Project Start", date: "Jan 2024" },
      { label: "Phase 1 Complete", date: "Mar 2024" },
      { label: "Beta Launch", date: "Jun 2024" },
      { label: "Public Release", date: "Sep 2024" },
      { label: "Version 2.0", date: "Dec 2024" },
    ];
  }, [events]);

  return (
    <div className={styles.container} role="img" aria-label="timeline chart" {...props}>
      <div className={styles.timeline}>
        <div className={styles.line} style={{ backgroundColor: lineColor }} />
        {computedEvents.map((event, i) => (
          <div
            key={i}
            className={`${styles.event} ${animate ? styles.animate : ""}`}
            style={{ animationDelay: animate ? `${i * 150}ms` : undefined }}
          >
            <div
              className={styles.dot}
              style={{ backgroundColor: event.color || dotColor }}
            />
            <div className={styles.content}>
              <span className={styles.label}>{event.label}</span>
              <span className={styles.date}>{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineChart;
