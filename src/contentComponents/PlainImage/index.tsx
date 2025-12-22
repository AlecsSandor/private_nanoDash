import React from "react";
import styles from "./styles.module.scss";

export type ImageLayout = "row" | "column" | "grid" | "masonry";
export type ImageFit = "cover" | "contain" | "fill" | "none";
export type ImageSize = "fixed" | "auto" | "equal";

export interface ImageItem {
  src: string;
  label?: string;
  alt?: string;
}

export interface PlainImageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Single image source or array of image items */
  images: string | ImageItem | (string | ImageItem)[];
  /** Layout mode for multiple images */
  layout?: ImageLayout;
  /** How images should fit their container */
  fit?: ImageFit;
  /** Sizing mode: fixed (use fixedWidth/fixedHeight), auto (natural size), equal (distribute equally) */
  sizing?: ImageSize;
  /** Fixed width for images (when sizing="fixed") */
  fixedWidth?: number | string;
  /** Fixed height for images (when sizing="fixed") */
  fixedHeight?: number | string;
  /** Number of images per row (for grid layout) */
  itemsPerRow?: number;
  /** Gap between images */
  gap?: number | string;
  /** Border radius for images */
  borderRadius?: number | string;
  /** Show labels below images */
  showLabels?: boolean;
  /** Label position */
  labelPosition?: "bottom" | "overlay";
}

export const plainImageDefaultProps: Omit<PlainImageProps, "images"> = {
  layout: "row",
  fit: "cover",
  sizing: "equal",
  itemsPerRow: 3,
  gap: 8,
  borderRadius: 8,
  showLabels: true,
  labelPosition: "bottom",
};

const PlainImage: React.FC<PlainImageProps> = ({
  images,
  layout = "row",
  fit = "cover",
  sizing = "equal",
  fixedWidth,
  fixedHeight,
  itemsPerRow = 3,
  gap = 8,
  borderRadius = 8,
  showLabels = true,
  labelPosition = "bottom",
  className,
  style,
  ...props
}) => {
  // Normalize images to array of ImageItem
  const normalizeImages = (): ImageItem[] => {
    if (!images) return [];
    
    const imageArray = Array.isArray(images) ? images : [images];
    
    return imageArray.map((img, index) => {
      if (typeof img === "string") {
        return { src: img, alt: `Image ${index + 1}` };
      }
      return { ...img, alt: img.alt || img.label || `Image ${index + 1}` };
    });
  };

  const imageItems = normalizeImages();
  const isSingle = imageItems.length === 1;

  const getContainerClasses = (): string => {
    const classes = [styles.container];
    
    if (layout === "row") classes.push(styles.layoutRow);
    else if (layout === "column") classes.push(styles.layoutColumn);
    else if (layout === "grid") classes.push(styles.layoutGrid);
    else if (layout === "masonry") classes.push(styles.layoutMasonry);
    
    if (isSingle) classes.push(styles.single);
    if (className) classes.push(className);
    
    return classes.join(" ");
  };

  const getContainerStyle = (): React.CSSProperties => {
    const containerStyle: React.CSSProperties = {
      gap: typeof gap === "number" ? `${gap}px` : gap,
      ...style,
    };

    if (layout === "grid") {
      containerStyle.gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`;
    }

    if (layout === "masonry") {
      containerStyle.columnCount = itemsPerRow;
      containerStyle.columnGap = typeof gap === "number" ? `${gap}px` : gap;
    }

    return containerStyle;
  };

  const getImageWrapperStyle = (): React.CSSProperties => {
    const wrapperStyle: React.CSSProperties = {};

    if (sizing === "fixed") {
      if (fixedWidth) {
        wrapperStyle.width = typeof fixedWidth === "number" ? `${fixedWidth}px` : fixedWidth;
        wrapperStyle.flexShrink = 0;
      }
      if (fixedHeight) {
        wrapperStyle.height = typeof fixedHeight === "number" ? `${fixedHeight}px` : fixedHeight;
      }
    } else if (sizing === "auto") {
      wrapperStyle.width = "auto";
      wrapperStyle.height = "auto";
    }

    return wrapperStyle;
  };

  const getImageStyle = (): React.CSSProperties => {
    return {
      objectFit: fit,
      borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    };
  };

  const renderImage = (item: ImageItem, index: number) => {
    const hasLabel = showLabels && item.label;
    const wrapperClasses = [
      styles.imageWrapper,
      labelPosition === "overlay" && hasLabel ? styles.overlayLabel : "",
      layout === "masonry" ? styles.masonryItem : "",
    ].filter(Boolean).join(" ");

    return (
      <div
        key={index}
        className={wrapperClasses}
        style={getImageWrapperStyle()}
      >
        <img
          src={item.src}
          alt={item.alt}
          className={styles.image}
          style={getImageStyle()}
        />
        {hasLabel && (
          <span
            className={`${styles.label} ${labelPosition === "overlay" ? styles.labelOverlay : styles.labelBottom}`}
          >
            {item.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={getContainerClasses()}
      style={getContainerStyle()}
      role="img"
      aria-label="image gallery"
      {...props}
    >
      {imageItems.map((item, index) => renderImage(item, index))}
    </div>
  );
};

export default PlainImage;
