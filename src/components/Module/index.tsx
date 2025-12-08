import React, { useState, useRef, useCallback } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule, openSidePanel } from "../../store/features/ui/uiSlice";

export interface ModuleProps {
  id: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  title: string;
  subtitle: string;
  others: { id: string; x: number; y: number; width: number; height: number }[];
  onPositionChange: (id: string, x: number, y: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Module: React.FC<ModuleProps> = ({
  id,
  position,
  width,
  height,
  title,
  subtitle,
  others,
  onPositionChange,
  className,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);

  const posRef = useRef(position);
  const prevValidPos = useRef(position);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Click detection
  const clickStartRef = useRef({ x: 0, y: 0 });

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
    clickStartRef.current = { x: e.clientX, y: e.clientY };

    setIsDragging(true);

    dragStartRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };

    prevValidPos.current = posRef.current;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      posRef.current = {
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      };

      onPositionChange(id, posRef.current.x, posRef.current.y);
    },
    [id, isDragging, onPositionChange]
  );

  const detectClick = (e: MouseEvent) => {
    const dx = Math.abs(e.clientX - clickStartRef.current.x);
    const dy = Math.abs(e.clientY - clickStartRef.current.y);
    return dx < 3 && dy < 3;
  };

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      // CLICK
      if (detectClick(e)) {
        dispatch(setSelectedModule(id));
        dispatch(openSidePanel());
        setIsDragging(false);
        return;
      }

      setIsDragging(false);

      const snappedX = Math.round(posRef.current.x / 56) * 56;
      const snappedY = Math.round(posRef.current.y / 56) * 56;

      if (checkOverlap(snappedX, snappedY)) {
        posRef.current = prevValidPos.current;
      } else {
        posRef.current = { x: snappedX, y: snappedY };
      }

      onPositionChange(id, posRef.current.x, posRef.current.y);
    },
    [id, isDragging, onPositionChange]
  );

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
      className={clsx(
        classes.Module,
        "Module",                         // ⬅ GLOBAL CLASS FOR OUTSIDE CLICK
        className,
        { [classes.selected]: selectedModuleId === id }
      )}
      style={{
        zIndex: isDragging ? 999 : 1,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        width,
        height,
        position: "absolute",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={classes.ContentWrapper}>
        <div className={classes.titleWrapper}>
          <p className={classes.title}>{title}</p>
          <p className={classes.subtitle}>{subtitle}</p>
        </div>
        <div className={classes.innerContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Module;
