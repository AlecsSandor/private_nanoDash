import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedModule,
  openSidePanel,
} from "../../store/features/ui/uiSlice";

/* ────────────────────────────────────────────── */
/* Utilities */
/* ────────────────────────────────────────────── */

const GRID = 56;

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const listener = () => setIsMobile(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
};

/* ────────────────────────────────────────────── */

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
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);

  const dispatch = useDispatch();
  const selectedModuleId = useSelector(
    (state: any) => state.ui.selectedModuleId
  );
  const allModules = useSelector((state: any) => state.modules.items);

  const pixelWidth = width * GRID;
  const pixelHeight = height * GRID;

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

  // Mobile tap guard
  const tapAllowedRef = useRef(true);

  const checkOverlap = (newX: number, newY: number) => {
    const A = { x: newX, y: newY, w: pixelWidth, h: pixelHeight };
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
    if (isMobile) return; // disable drag on mobile

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

      if (moduleRef.current) {
        moduleRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
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

      const snappedX = Math.round(posRef.current.x / GRID) * GRID;
      const snappedY = Math.round(posRef.current.y / GRID) * GRID;

      if (checkOverlap(snappedX, snappedY)) {
        posRef.current = prevValidPos.current;
      } else {
        posRef.current = { x: snappedX, y: snappedY };
      }

      if (moduleRef.current) {
        moduleRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      onPositionChange(id, posRef.current.x, posRef.current.y);
    },
    [id, isDragging, onPositionChange]
  );

  useEffect(() => {
    if (!isMobile && isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, isMobile]);

  // ────── MOBILE TAP HANDLERS ──────
  const selectModule = () => {
    dispatch(setSelectedModule(id));
    dispatch(openSidePanel());
  };

  const handleTouchStart = () => {
    tapAllowedRef.current = true;
  };

  const handleTouchMove = () => {
    tapAllowedRef.current = false;
  };

  const handleClick = () => {
    if (isMobile && tapAllowedRef.current) {
      selectModule();
    }
  };

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
        width: pixelWidth,
        height: pixelHeight,
        position: isMobile ? "relative" : "absolute",
        transform: isMobile
          ? undefined
          : `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 999 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
    >
      <div className={classes.ContentWrapper}>
        <div className={classes.titleWrapper}>
          <p className={classes.title}>{title}</p>
          <p className={classes.subtitle}>{subtitle}</p>
        </div>
        <div className={classes.innerContent}>{children}</div>
      </div>
    </div>
  );
};

export const Module = React.memo(ModuleComponent);
export default Module;
