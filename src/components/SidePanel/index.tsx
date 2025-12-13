import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSidePanel,
} from "../../store/features/ui/uiSlice";

import {
  updateModulePosition,
  updateModuleSize,
  updateModuleProps,
  updateModuleType
} from "../../store/features/modules/modulesSlice";

import { componentMap } from "../../contentComponents/componentMap";

import classes from "./styles.module.scss";

export const SidePanel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
  const modules = useSelector((state: any) => state.modules.items || []);
  const selectedModule = modules.find((m: any) => m.id === selectedModuleId);

  // ---- Stable local state ----
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

  // 🔥 Conditional rendering only AFTER hooks
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

  const propsObj = selectedModule.props || {};

  // ---------------------------------------
  // Helper: update a nested API config block
  // ---------------------------------------
  const updateApiConfig = (updates: Partial<typeof selectedModule.api>) => {
    if (!selectedModule.api) return;
    dispatch(
      updateModuleProps({
        id: selectedModule.id,
        key: "api",
        value: {
          ...selectedModule.api, // keep existing fields
          ...updates,            // apply updates
        },
      })
    );
  };

  // ---- AUTOMATIC PROP INPUT RENDERING ----
  const renderPropField = (key: string, value: any) => {
    const handleChange = (newValue: any) => {
      dispatch(
        updateModuleProps({
          id: selectedModule.id,
          key,
          value: newValue,
        })
      );
    };

    // Number
    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
        />
      );
    }

    // Boolean
    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handleChange(e.target.checked)}
        />
      );
    }

    // String
    if (typeof value === "string") {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
    }

    // Array or Object → JSON editor
    return (
      <textarea
        value={JSON.stringify(value, null, 2)}
        onChange={(e) => {
          try {
            handleChange(JSON.parse(e.target.value));
          } catch {
            /* keep input until valid JSON */
          }
        }}
      />
    );
  };

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

        {/* ===== POSITIONS ===== */}
        <div className={classes.group}>
          <label>Position X</label>
          <input
            type="number"
            value={tempX}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempX(val);
              dispatch(updateModulePosition({ id: selectedModule.id, x: val, y: tempY }));
            }}
          />
        </div>

        <div className={classes.group}>
          <label>Position Y</label>
          <input
            type="number"
            value={tempY}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempY(val);
              dispatch(updateModulePosition({ id: selectedModule.id, x: tempX, y: val }));
            }}
          />
        </div>

        {/* WIDTH + HEIGHT */}
        <div className={classes.group}>
          <label>Width</label>
          <input
            type="number"
            value={tempW}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempW(val);
              dispatch(updateModuleSize({ id: selectedModule.id, width: val, height: tempH }));
            }}
          />
        </div>

        <div className={classes.group}>
          <label>Height</label>
          <input
            type="number"
            value={tempH}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTempH(val);
              dispatch(updateModuleSize({ id: selectedModule.id, width: tempW, height: val }));
            }}
          />
        </div>

        {/* ==============================
              MODULE TYPE SELECTOR
            ============================== */}
        <div className={classes.group}>
          <label>Component Type</label>
          <select
            value={selectedModule.type}
            onChange={(e) => {
              const newType = e.target.value;
              dispatch(updateModuleType({ id: selectedModule.id, type: newType }));
            }}
          >
            {Object.keys(componentMap).map((typeKey) => (
              <option key={typeKey} value={typeKey}>
                {typeKey}
              </option>
            ))}
          </select>
        </div>

        {/* ==========================================
              API MODULE SETTINGS (if type === "api")
           ========================================== */}
        {selectedModule.type === "api" && (
          <>
            <h3 className={classes.sectionTitle}>API Settings</h3>

            {/* URL */}
            <div className={classes.group}>
              <label>URL</label>

              <input
                type="text"
                value={selectedModule.api?.url ?? ""}
                onChange={(e) => updateApiConfig({ url: e.target.value })}
              />
            </div>

            {/* Method */}
            <div className={classes.group}>
              <label>Method</label>

              <select
                value={selectedModule.api?.method ?? "GET"}
                onChange={(e) => updateApiConfig({ method: e.target.value })}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>

            {/* Body (only if non-GET) */}
            {(selectedModule.api?.method ?? "GET") !== "GET" && (
              <div className={classes.group}>
                <label>Body (JSON)</label>

                <textarea
                  value={
                    selectedModule.api?.body
                      ? JSON.stringify(selectedModule.api.body, null, 2)
                      : ""
                  }
                  onChange={(e) => {
                    try {
                      updateApiConfig({ body: JSON.parse(e.target.value) });
                    } catch {
                      // ignore invalid JSON until corrected
                    }
                  }}
                />
              </div>
            )}

            {/* Headers */}
            <div className={classes.group}>
              <label>Headers (JSON)</label>
              <textarea
                value={JSON.stringify(selectedModule.api?.headers ?? {}, null, 2)}
                onChange={(e) => {
                  try {
                    updateApiConfig({ headers: JSON.parse(e.target.value) });
                  } catch { }
                }}
              />
            </div>

            {/* Polling enable */}
            <div className={classes.group}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedModule.api?.enabled}
                  onChange={(e) => updateApiConfig({ enabled: e.target.checked })}
                />
                Enable Automatic Refresh
              </label>

            </div>

            {/* Polling interval */}
            <div className={classes.group}>
              <label>Refresh Interval (ms)</label>

              <input
                type="number"
                value={selectedModule.api?.refreshIntervalMs ?? 0}
                onChange={(e) =>
                  updateApiConfig({ refreshIntervalMs: Number(e.target.value) })
                }
              />
            </div>

            {/* Transform path */}
            <div className={classes.group}>
              <label>Transform Path</label>
              <input
                type="text"
                value={selectedModule.api?.transformPath ?? ""}
                onChange={(e) => updateApiConfig({ transformPath: e.target.value })}
              />
            </div>

            <div className={classes.separator} />
          </>
        )}

        {/* ==========================================
              GENERIC MODULE PROPS (NOT for API)
           ========================================== */}
        {selectedModule.type !== "api" && (
          <>
            <h3 className={classes.sectionTitle}>Component Props</h3>

            {Object.keys(propsObj).map((key) => (
              <div className={classes.group} key={key}>
                <label>{key}</label>
                {renderPropField(key, propsObj[key])}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
};

export default SidePanel;
