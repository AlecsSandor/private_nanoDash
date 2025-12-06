import React, { useState, useRef, useCallback } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";

export interface ModuleProps {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  others: { id: string; x: number; y: number; width: number; height: number }[];
  onPositionChange: (id: string, x: number, y: number) => void;
  className?: string;
}

export const Module: React.FC<ModuleProps> = ({
  id,
  position,
  width,
  height,
  others,
  onPositionChange,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const posRef = useRef(position);
  const prevValidPos = useRef(position);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const moduleRef = useRef<HTMLDivElement>(null);

  const checkOverlap = (newX: number, newY: number) => {
    const A = { x: newX, y: newY, w: width, h: height };

    return others.some((B) => {
      return !(
        A.x + A.w <= B.x ||
        A.x >= B.x + B.width ||
        A.y + A.h <= B.y ||
        A.y >= B.y + B.height
      );
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    prevValidPos.current = posRef.current;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    posRef.current = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };

    onPositionChange(id, posRef.current.x, posRef.current.y);
  }, [id, isDragging, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const snappedX = Math.round(posRef.current.x / 56) * 56;
    const snappedY = Math.round(posRef.current.y / 56) * 56;

    // If overlaps → revert to previous valid
    if (checkOverlap(snappedX, snappedY)) {
      posRef.current = prevValidPos.current;
    } else {
      posRef.current = { x: snappedX, y: snappedY };
    }

    onPositionChange(id, posRef.current.x, posRef.current.y);
  }, [id, isDragging, onPositionChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={moduleRef}
      className={clsx(classes.Module, className)}
      style={{
        zIndex: isDragging ? 999 : 1,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        width,
        height,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={classes.ContentWrapper}></div>
    </div>
  );
};

export default Module;
