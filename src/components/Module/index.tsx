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
  width: number;
  height: number;
  title: string;
  subtitle: string;
  onPositionChange: (id: string, x: number, y: number) => void;
  className?: string;
  children?: React.ReactNode;
}

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

  // 🔥 Compute others internally using fresh redux values
  const others = useMemo<OtherModule[]>(() => {
  return allModules
    .filter((m: any) => m.id !== id)
    .map((m: any) => ({
      id: m.id,
      x: m.x,
      y: m.y,
      width: m.width,
      height: m.height,
    }));
}, [allModules, id]);

  const posRef = useRef(position);
  const prevValidPos = useRef(position);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const clickStartRef = useRef({ x: 0, y: 0 });
  const moduleRef = useRef<HTMLDivElement>(null);

  // 🔥 Correct overlap detection using internal state
  const checkOverlap = (newX: number, newY: number) => {
  const A = { x: newX, y: newY, w: width, h: height };

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

      // 🔥 No React render — update DOM directly
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

      // CLICK (no drag)
      if (detectClick(e)) {
        dispatch(setSelectedModule(id));
        dispatch(openSidePanel());
        setIsDragging(false);
        return;
      }

      setIsDragging(false);

      // 🔥 Snap to grid
      const snappedX = Math.round(posRef.current.x / 56) * 56;
      const snappedY = Math.round(posRef.current.y / 56) * 56;

      // 🔥 Prevent overlap using fresh Redux state
      if (checkOverlap(snappedX, snappedY)) {
        posRef.current = prevValidPos.current;
      } else {
        posRef.current = { x: snappedX, y: snappedY };
      }

      // Update DOM transform BEFORE dispatch to avoid jump
      if (moduleRef.current) {
        moduleRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      // Update Redux AFTER release (causes 1 re-render)
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

export const Module = React.memo(ModuleComponent);
export default Module;
