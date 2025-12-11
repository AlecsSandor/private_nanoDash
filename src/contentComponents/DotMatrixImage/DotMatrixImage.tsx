import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./styles.module.scss";

export interface DotMatrixImageProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  dotSpacing?: number;
  dotSize?: number;
  dotStyle?: "circle" | "square" | "diamond";
  backgroundColor?: string;
}

interface DotData {
  x: number;
  y: number;
  color: string;
}

const DotMatrixImage: React.FC<DotMatrixImageProps> = ({
  imageSrc = "https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg",
  dotSpacing = 7,
  dotSize = 4,
  dotStyle = "square",
  backgroundColor = "hsl(60, 10%, 85%)",
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<DotData[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const processImage = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    setDimensions({ width, height });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas scaled to fit
      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Sample pixels at regular intervals based on dotSpacing
      const newDots: DotData[] = [];
      const cols = Math.floor(width / dotSpacing);
      const rows = Math.floor(height / dotSpacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dotSpacing + dotSpacing / 2;
          const y = row * dotSpacing + dotSpacing / 2;

          const pixelData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
          const r = pixelData[0];
          const g = pixelData[1];
          const b = pixelData[2];

          newDots.push({ x, y, color: `rgb(${r}, ${g}, ${b})` });
        }
      }

      setDots(newDots);
    };

    img.src = imageSrc;
  }, [imageSrc, dotSpacing]);

  useEffect(() => {
    processImage();

    const resizeObserver = new ResizeObserver(() => {
      processImage();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [processImage]);

  const getDotStyle = (dot: DotData): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: dot.x - dotSize / 2,
      top: dot.y - dotSize / 2,
      width: dotSize,
      height: dotSize,
      backgroundColor: dot.color,
    };

    switch (dotStyle) {
      case "square":
        return baseStyle;
      case "diamond":
        return { ...baseStyle, transform: "rotate(45deg)" };
      case "circle":
      default:
        return { ...baseStyle, borderRadius: "50%" };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[dotStyle]} ${className || ""}`}
      //style={{ backgroundColor }}
      {...props}
    >
      <canvas ref={canvasRef} className={styles.hiddenCanvas} />
      <div className={styles.dotsContainer}>
        {dots.map((dot, index) => (
          <div
            key={`${index}-${dot.x}-${dot.y}`}
            className={styles.dot}
            style={getDotStyle(dot)}
          />
        ))}
      </div>
    </div>
  );
};

export default DotMatrixImage;
