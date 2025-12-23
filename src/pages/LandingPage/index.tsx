import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Module } from "../../components/Module";
import { useDispatch, useSelector } from "react-redux";
import { deselectModule } from "../../store/features/ui/uiSlice";
import { updateModulePosition } from "../../store/features/modules/modulesSlice";
import { ModuleType } from "../../types/store";
import { MenuBar } from "../../components/MenuBar";
import { ModuleRenderer } from "./ModuleRenderer/ModuleRenderer";

/* ────────────────────────────────────────────── */
/* Utilities */
/* ────────────────────────────────────────────── */

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

export const LandingPage = () => {
  const dispatch = useDispatch();
  const modules: ModuleType[] = useSelector(
    (state: any) => state.modules.items
  );

  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    const clickedModule = target.closest(".Module");
    const clickedSidePanel = target.closest(".SidePanel");
    const clickedMenuBar = target.closest(".MenuBar");
    const clickedFetch = target.closest(".fetchButton");

    if (!clickedModule && !clickedSidePanel && !clickedMenuBar && !clickedFetch) {
      dispatch(deselectModule());
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    dispatch(updateModulePosition({ id, x, y }));
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const center = window.innerWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(carouselRef.current.children).forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(center - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <div className={classes.LandingPage} onClick={handleClickOutside}>
      {isMobile ? (
        <div
          ref={carouselRef}
          className={classes.MobileCarousel}
          onScroll={handleScroll}
        >
          {modules.map((module, index) => (
            <Module
              key={module.id}
              id={module.id}
              position={{ x: 0, y: 0 }}
              width={module.width}
              height={module.height}
              title={module.title}
              subtitle={module.subtitle}
              onPositionChange={() => {}}
              className={clsx(
                classes.MobileModule,
                index === activeIndex
                  ? classes.active
                  : classes.inactive
              )}
            >
              <ModuleRenderer module={module} />
            </Module>
          ))}
        </div>
      ) : (
        <div className={classes.AppHeader}>
          {modules.map((module) => (
            <Module
              key={module.id}
              id={module.id}
              position={{ x: module.x, y: module.y }}
              width={module.width}
              height={module.height}
              title={module.title}
              subtitle={module.subtitle}
              onPositionChange={handlePositionChange}
            >
              <ModuleRenderer module={module} />
            </Module>
          ))}
        </div>
      )}

      <MenuBar />
    </div>
  );
};

export default LandingPage;
