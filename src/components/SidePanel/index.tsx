import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel } from "../../store/features/ui/uiSlice";
import classes from "./styles.module.scss";

export const SidePanel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);

  // Example: modules stored in parent or redux — optional
  const modules = useSelector((state: any) => state.modules?.items || []);

  const selectedModule = modules.find((m: any) => m.id === selectedModuleId);

  return (
    <div
      className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}
    >
      <div className={classes.header}>
        <h2>Module Settings</h2>
        <button className={classes.closeButton} onClick={() => dispatch(closeSidePanel())}>
          ✕
        </button>
      </div>

      {!selectedModule ? (
        <div className={classes.placeholder}>
          Select a module to edit
        </div>
      ) : (
        <div className={classes.content}>
          <div className={classes.group}>
            <label>ID</label>
            <div className={classes.fieldReadonly}>{selectedModule.id}</div>
          </div>

          <div className={classes.group}>
            <label>Position X</label>
            <input type="number" defaultValue={selectedModule.x} />
          </div>

          <div className={classes.group}>
            <label>Position Y</label>
            <input type="number" defaultValue={selectedModule.y} />
          </div>

          <div className={classes.group}>
            <label>Width</label>
            <input type="number" defaultValue={selectedModule.width} />
          </div>

          <div className={classes.group}>
            <label>Height</label>
            <input type="number" defaultValue={selectedModule.height} />
          </div>

          {/* You can add more controls here */}

        </div>
      )}
    </div>
  );
};

export default SidePanel;
