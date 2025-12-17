import React from "react";
import styles from "./styles.module.scss";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TextWeight = "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type TextAlign = "left" | "center" | "right" | "justify";

export interface TextDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  size?: TextSize;
  weight?: TextWeight;
  color?: string;
  backgroundColor?: string;
  align?: TextAlign;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  truncate?: boolean;
  maxLines?: number;
  animate?: boolean;
}

export const textDisplayDefaultProps: Omit<TextDisplayProps, "text"> = {
  size: "md",
  weight: "normal",
  color: "hsl(var(--foreground))",
  backgroundColor: "transparent",
  align: "left",
  italic: false,
  underline: false,
  strikethrough: false,
  uppercase: false,
  truncate: false,
  maxLines: undefined,
  animate: false,
};

const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  size = "md",
  weight = "normal",
  color = "hsl(var(--foreground))",
  backgroundColor = "transparent",
  align = "left",
  italic = false,
  underline = false,
  strikethrough = false,
  uppercase = false,
  truncate = false,
  maxLines,
  animate = false,
  className,
  style,
  ...props
}) => {
  const isHeading = size.startsWith("h");
  const Tag = isHeading ? (size as keyof JSX.IntrinsicElements) : "p";

  const textDecorations = [
    underline && "underline",
    strikethrough && "line-through",
  ].filter(Boolean).join(" ");

  const containerClasses = [
    styles.container,
    animate ? styles.animate : "",
    className || "",
  ].filter(Boolean).join(" ");

  const textClasses = [
    styles.text,
    styles[`size-${size}`],
    styles[`weight-${weight}`],
    styles[`align-${align}`],
    italic ? styles.italic : "",
    uppercase ? styles.uppercase : "",
    truncate ? styles.truncate : "",
    maxLines ? styles.clamp : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={containerClasses}
      style={{
        backgroundColor,
        ...style,
      }}
      {...props}
    >
      <Tag
        className={textClasses}
        style={{
          color,
          textDecoration: textDecorations || undefined,
          WebkitLineClamp: maxLines,
        }}
      >
        {text}
      </Tag>
    </div>
  );
};

export default TextDisplay;
