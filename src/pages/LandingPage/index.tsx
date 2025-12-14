import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Module } from "../../components/Module";
import { useDispatch, useSelector } from "react-redux";
import { deselectModule } from "../../store/features/ui/uiSlice";
import { updateModulePosition } from "../../store/features/modules/modulesSlice";
import { ModuleType } from "../../types/store";
import { MenuBar } from "../../components/MenuBar";

import { ModuleRenderer } from "./ModuleRenderer/ModuleRenderer";

export const LandingPage = () => {
  const dispatch = useDispatch();

  const modules: ModuleType[] = useSelector(
    (state: any) => state.modules.items
  );

  const containerRef = useRef<HTMLDivElement>(null);

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

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const disableBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) e.preventDefault();
    };

    document.addEventListener("wheel", disableBrowserZoom, { passive: false });

    return () => {
      document.removeEventListener("wheel", disableBrowserZoom);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;

    setZoom((prev) => {
      let next = prev + delta;
      return Math.min(Math.max(next, 0.5), 2.0);
    });
  };

  return (
    <div className={classes.LandingPage} onClick={handleClickOutside}>
      <div ref={containerRef} className={classes.AppHeader}>

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
            {/* ⬇️ NEW: Dynamic component with props */}
            <ModuleRenderer module={module} />
          </Module>
        ))}

      </div>

      <MenuBar />
    </div>
  );
};

export default LandingPage;
