import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSidePanel,
  // maybe also selectModule?
} from "../../store/features/ui/uiSlice";

import {
  updateModulePosition,
  updateModuleSize,
} from "../../store/features/modules/modulesSlice";

import classes from "./styles.module.scss";

export const SidePanel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
  const selectedModuleId = useSelector(
    (state: any) => state.ui.selectedModuleId
  );

  const modules = useSelector((state: any) => state.modules.items || []);
  const selectedModule = modules.find((m: any) => m.id === selectedModuleId);

  // 🔥 Hooks MUST be called unconditionally
  const [tempX, setTempX] = React.useState(0);
  const [tempY, setTempY] = React.useState(0);
  const [tempW, setTempW] = React.useState(0);
  const [tempH, setTempH] = React.useState(0);

  // Sync when module changes
  React.useEffect(() => {
    if (!selectedModule) return;

    setTempX(selectedModule.x);
    setTempY(selectedModule.y);
    setTempW(selectedModule.width);
    setTempH(selectedModule.height);
  }, [selectedModuleId]);

  // ❗ NOW the conditional return is allowed AFTER hooks
  if (!selectedModule) {
    return (
      <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
        <div className={classes.header}>
          <h2>Module Settings</h2>
        </div>

        <div className={classes.placeholder}>Select a module to edit</div>
      </div>
    );
  }

  return (
    <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
      <div className={classes.header}>
        <h2>Module Settings</h2>
        <button
          className={classes.closeButton}
          onClick={() => dispatch(closeSidePanel())}
        >
          ✕
        </button>
      </div>

      <div className={classes.content}>
        <div className={classes.group}>
          <label>ID</label>
          <div className={classes.fieldReadonly}>{selectedModule.id}</div>
        </div>

        {/* X */}
        <div className={classes.group}>
          <label>Position X</label>
          <input
            type="number"
            value={tempX}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempX(val);
              dispatch(
                updateModulePosition({
                  id: selectedModule.id,
                  x: val,
                  y: tempY,
                })
              );
            }}
          />
        </div>

        {/* Y */}
        <div className={classes.group}>
          <label>Position Y</label>
          <input
            type="number"
            value={tempY}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempY(val);
              dispatch(
                updateModulePosition({
                  id: selectedModule.id,
                  x: tempX,
                  y: val,
                })
              );
            }}
          />
        </div>

        {/* Width */}
        <div className={classes.group}>
          <label>Width</label>
          <input
            type="number"
            value={tempW}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempW(val);
              dispatch(
                updateModuleSize({
                  id: selectedModule.id,
                  width: val,
                  height: tempH,
                })
              );
            }}
          />
        </div>

        {/* Height */}
        <div className={classes.group}>
          <label>Height</label>
          <input
            type="number"
            value={tempH}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempH(val);
              dispatch(
                updateModuleSize({
                  id: selectedModule.id,
                  width: tempW,
                  height: val,
                })
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};


export default SidePanel;
