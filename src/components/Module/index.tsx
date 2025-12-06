import React, { useState, useRef, useCallback } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";

export interface ModuleProps {
  id: string;
  className?: string;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
}

export const Module: React.FC<ModuleProps> = ({ id, className, initialPosition, width, height }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef(initialPosition || { x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const moduleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    positionRef.current = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };
    setPosition(positionRef.current);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    // Snap to 56px grid
    const snappedX = Math.round(positionRef.current.x / 56) * 56;
    const snappedY = Math.round(positionRef.current.y / 56) * 56;
    positionRef.current = { x: snappedX, y: snappedY };
    setPosition(positionRef.current);
  }, [isDragging]);

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
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={classes.ContentWrapper}></div>
    </div>
  );
};

export default Module;
