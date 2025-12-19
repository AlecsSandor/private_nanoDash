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
      {/* <div className={classes.background}>
        <div className={classes.blobGreen} />
        <div className={classes.blobYellow} />
      </div> */}
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



{/* <svg xmlns="http://www.w3.org/2000/svg" width="225" height="224" viewBox="0 0 225 224" fill="none">
<foreignObject x="-10.7" y="-10.7" width="246.4" height="245.4"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(5.35px);clip-path:url(#bgblur_1_6156_1051_clip_path);height:100%;width:100%"></div></foreignObject><g data-figma-bg-blur-radius="10.7">
<g clip-path="url(#clip0_6156_1051)">
<rect width="225" height="224" rx="32" fill="#262626" fill-opacity="0.51"/>
<g filter="url(#filter1_f_6156_1051)">
<ellipse cx="66.4626" cy="231.515" rx="52.5" ry="50" transform="rotate(-11.5717 66.4626 231.515)" fill="url(#paint0_linear_6156_1051)"/>
</g>
<g filter="url(#filter2_f_6156_1051)">
<ellipse cx="-13.5374" cy="166.515" rx="52.5" ry="50" transform="rotate(-11.5717 -13.5374 166.515)" fill="#FFFF61"/>
</g>
</g>
<rect x="0.5" y="0.5" width="224" height="223" rx="31.5" stroke="url(#paint1_linear_6156_1051)"/>
</g>
<defs>
<clipPath id="bgblur_1_6156_1051_clip_path" transform="translate(10.7 10.7)"><rect width="225" height="224" rx="32"/>
</clipPath><filter id="filter1_f_6156_1051" x="-65.649" y="101.701" width="264.223" height="259.627" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="39.85" result="effect1_foregroundBlur_6156_1051"/>
</filter>
<filter id="filter2_f_6156_1051" x="-145.649" y="36.7014" width="264.223" height="259.627" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="39.85" result="effect1_foregroundBlur_6156_1051"/>
</filter>
<linearGradient id="paint0_linear_6156_1051" x1="113.963" y1="181.515" x2="18.9626" y2="281.515" gradientUnits="userSpaceOnUse">
<stop stop-color="#77E036"/>
<stop offset="1" stop-color="#D2E339"/>
</linearGradient>
<linearGradient id="paint1_linear_6156_1051" x1="225" y1="0" x2="16" y2="230" gradientUnits="userSpaceOnUse">
<stop stop-color="#454444"/>
<stop offset="0.322115" stop-color="#252525"/>
<stop offset="0.644231" stop-color="#2B2B2B"/>
<stop offset="1" stop-color="#454444"/>
</linearGradient>
<clipPath id="clip0_6156_1051">
<rect width="225" height="224" rx="32" fill="white"/>
</clipPath>
</defs>
</svg> */}