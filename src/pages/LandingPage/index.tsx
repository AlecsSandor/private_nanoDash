import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Module } from "../../components/Module";
import { useDispatch, useSelector } from "react-redux";
import { deselectModule } from "../../store/features/ui/uiSlice";
import { updateModulePosition } from "../../store/features/modules/modulesSlice";
import { ModuleType } from "../../types/store";
import { MenuBar } from "../../components/MenuBar";

import componentMap from "../../contentComponents/componentMap";

export const LandingPage = () => {
  const dispatch = useDispatch();
  //const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
  const modules: ModuleType[] = useSelector(
    (state: any) => state.modules.items
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    const clickedModule = target.closest(".Module");
    const clickedSidePanel = target.closest(".SidePanel");
    const clickedMenuBar = target.closest(".MenuBar");

    //if (!selectedModuleId) return;

    if (!clickedModule && !clickedSidePanel && !clickedMenuBar) {
      dispatch(deselectModule());
    }
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    dispatch(updateModulePosition({ id, x, y }));
  };

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const disableBrowserZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", disableBrowserZoom, { passive: false });

    return () => {
      document.removeEventListener("wheel", disableBrowserZoom);
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const zoomSpeed = 0.0015;
    const delta = -e.deltaY * zoomSpeed;

    setZoom((prev) => {
      let next = prev + delta;
      next = Math.min(Math.max(next, 0.5), 2.0); // clamp
      return next;
    });
  };

  return (
    <div className={classes.LandingPage} onClick={handleClickOutside}>
      <div ref={containerRef} className={classes.AppHeader}>
        {/* <div
          className={classes.Workspace}
          onWheel={handleWheel}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        > */}
        {modules.map((module) => {
          const ChartComponent = componentMap[module.type];

          return (
            <Module
              key={module.id}
              id={module.id}
              position={{ x: module.x, y: module.y }}
              width={module.width}
              height={module.height}
              title={module.title}
              subtitle={module.subtitle}
              //others={modules.filter((m) => m.id !== module.id)}
              //others={modules}
              onPositionChange={handlePositionChange}
            >
              {ChartComponent ? <ChartComponent /> : null}
            </Module>
          );
        })}
        {/* </div> */}
      </div>
      <MenuBar />
    </div>
  );
};

export default LandingPage;

