import React, { useState, useRef, useCallback, useMemo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedModule, openSidePanel } from "../../store/features/ui/uiSlice";

type OtherModule = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ModuleProps {
  id: string;
  position: { x: number; y: number };
  width: number;    // grid units
  height: number;   // grid units
  title: string;
  subtitle: string;
  onPositionChange: (id: string, x: number, y: number) => void;
  className?: string;
  children?: React.ReactNode;
}

const GRID = 56;

const ModuleComponent: React.FC<ModuleProps> = ({
  id,
  position,
  width,
  height,
  title,
  subtitle,
  onPositionChange,
  className,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);

  const allModules = useSelector((state: any) => state.modules.items);

  // Convert grid units → pixels
  const pixelWidth = width * GRID;
  const pixelHeight = height * GRID;

  // Compute "others" fresh from Redux (converted to pixels)
  const others = useMemo<OtherModule[]>(() => {
    return allModules
      .filter((m: any) => m.id !== id)
      .map((m: any) => ({
        id: m.id,
        x: m.x,
        y: m.y,
        width: m.width * GRID,
        height: m.height * GRID,
      }));
  }, [allModules, id]);

  const posRef = useRef(position);
  const prevValidPos = useRef(position);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const clickStartRef = useRef({ x: 0, y: 0 });
  const moduleRef = useRef<HTMLDivElement>(null);

  // Overlap detection using pixel sizes
  const checkOverlap = (newX: number, newY: number) => {
    const A = { x: newX, y: newY, w: pixelWidth, h: pixelHeight };

    return others.some((B: OtherModule) => {
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

      // Smooth movement without React re-render
      if (moduleRef.current) {
        moduleRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }
    },
    [isDragging]
  );

  const detectClick = (e: MouseEvent) => {
    const dx = Math.abs(e.clientX - clickStartRef.current.x);
    const dy = Math.abs(e.clientY - clickStartRef.current.y);
    return dx < 3 && dy < 3;
  };

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      if (detectClick(e)) {
        dispatch(setSelectedModule(id));
        dispatch(openSidePanel());
        setIsDragging(false);
        return;
      }

      setIsDragging(false);

      // Snap to 56px grid
      const snappedX = Math.round(posRef.current.x / GRID) * GRID;
      const snappedY = Math.round(posRef.current.y / GRID) * GRID;

      // Prevent overlaps
      if (checkOverlap(snappedX, snappedY)) {
        posRef.current = prevValidPos.current;
      } else {
        posRef.current = { x: snappedX, y: snappedY };
      }

      // Update DOM transform before Redux dispatch
      if (moduleRef.current) {
        moduleRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      // Update Redux (1 re-render after drag ends)
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
        "Module",
        className,
        { [classes.selected]: selectedModuleId === id }
      )}
      style={{
        zIndex: isDragging ? 999 : 1,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        width: pixelWidth,
        height: pixelHeight,
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

export const Module = React.memo(ModuleComponent);
export default Module;
