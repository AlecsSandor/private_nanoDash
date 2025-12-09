import { useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";
import { Module } from "../../components/Module";
import { useDispatch, useSelector } from "react-redux";
import { deselectModule } from "../../store/features/ui/uiSlice";
import { updateModulePosition } from "../../store/features/modules/modulesSlice";
import { ModuleType } from "../../types/store";
import { MenuBar } from "../../components/MenuBar";

import BarChart from "../../contentComponents/BarChart";
import AreaChart from "../../contentComponents/AreaChart/AreaChart";
import BubbleChart from "../../contentComponents/BubbleChart/BubbleChart";
import PieChart from "../../contentComponents/PieChart/PieChart";
import LineChart from "../../contentComponents/LineChart/LineChart";
import ScatterPlot from "../../contentComponents/ScatterPlot/ScatterPlot";
import CandlestickChart from "../../contentComponents/CandlestickChart/CandlestickChart";
import ColumnChart from "../../contentComponents/ColumnChart/ColumnChart";
import DonutChart from "../../contentComponents/DonutChart/DonutChart";
import GaugeChart from "../../contentComponents/GaugeChart/GaugeChart";
import Heatmap from "../../contentComponents/Heatmap/Heatmap";
import HorizontalBarChart from "../../contentComponents/HorizontalBar/HorizontalBarChart";
import RadarChart from "../../contentComponents/RadarChart/RadarChart";
import RadialProgress from "../../contentComponents/RadialProgress/RadialProgress";
import SparklineChart from "../../contentComponents/SparklineChart/SparklineChart";
import TimelineChart from "../../contentComponents/TimelineChart/TimelineChart";

export const LandingPage = () => {
  const dispatch = useDispatch();
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
  const modules: ModuleType[] = useSelector(
    (state: any) => state.modules.items
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    const clickedModule = target.closest(".Module");
    const clickedSidePanel = target.closest(".SidePanel");
    const clickedMenuBar = target.closest(".MenuBar");

    if (!selectedModuleId) return;

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
          {modules.map((module) => (
            <Module
              key={module.id}
              id={module.id}
              position={{ x: module.x, y: module.y }}
              width={module.width}
              height={module.height}
              title={module.title}
              subtitle={module.subtitle}
              others={modules.filter((m) => m.id !== module.id)}
              onPositionChange={handlePositionChange}
                
            >          
            </Module>            
          ))}
          <Module
            id="test"
            position={{ x: 100, y: 100}}
            width={224}
            height={224}
            title=""
            subtitle=""
            others={modules.filter((m) => m.id !== module.id)}
            onPositionChange={handlePositionChange}
          >
           
          </Module>

          <Module
            id="testssds"
            position={{ x: 400, y: 400}}
            width={224}
            height={224}
            title=""
            subtitle=""
            others={modules.filter((m) => m.id !== module.id)}
            onPositionChange={handlePositionChange}
          >
            <RadialProgress />
          </Module>
        {/* </div> */}
      </div>
      <MenuBar />
    </div>
  );
};

export default LandingPage;

