import React from "react";
import classes from "./styles.module.scss";
import { ApiModuleProps } from "../../types/store";
import { apiModulesService } from "../../services/apiModuleServices";
import { updateModuleProps } from "../../store/features/modules/modulesSlice";
import { useDispatch } from "react-redux";


interface ApiModuleFullProps extends ApiModuleProps {
  moduleId: string;          // add module ID
  //onFetch?: () => void;
}

const ApiModule: React.FC<ApiModuleFullProps> = ({
  moduleId,
 name,
  url,
  method,
  headers,
  enabled,
  refreshIntervalMs,
  responseSchema,
  transformPath,

  isFetching,
  lastFetchedAt,
  lastFetchError,

  lastData,
  //onFetch,
}) => {

  const dispatch = useDispatch();

  const handleFetch = async () => {
    if (!url) return;
    
    dispatch(updateModuleProps({ id: moduleId, key: "isFetching", value: true }));
    dispatch(updateModuleProps({ id: moduleId, key: "lastFetchError", value: null }));
  
    try {
      const data = await apiModulesService.fetchApiModuleData({ url, method, headers });

      dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: data }));
      dispatch(updateModuleProps({ id: moduleId, key: "lastFetchedAt", value: Date.now() }));
      // optional callback for parent
      // onFetch?.();
    } catch (err: any) {
      dispatch(updateModuleProps({ id: moduleId, key: "lastFetchError", value: err.message || "Error" }));
    } finally {
      dispatch(updateModuleProps({ id: moduleId, key: "isFetching", value: false }));
    }
  };

  React.useEffect(() => {
    if (!enabled || !refreshIntervalMs) return;

    const interval = setInterval(() => {
      handleFetch();
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [enabled, refreshIntervalMs, url, method, headers]);

  return (
    <div className={classes.ApiModule}>

      <div className={classes.section}>
        <div className={classes.label}>URL</div>
        <div className={classes.value}>{url || "—"}</div>
      </div>

      <div className={classes.sectionRow}>
        <div className={classes.section}>
          <div className={classes.label}>Method</div>
          <div className={classes.value}>{method}</div>
        </div>

        <button className={classes.fetchButton} onClick={handleFetch}>
          Fetch
        </button>
      </div>

      <div className={classes.statusBox}>
        <div className={classes.statusRow}>
          <span className={classes.statusLabel}>Status:</span>
          {isFetching ? (
            <span className={classes.loading}>Fetching…</span>
          ) : lastFetchError ? (
            <span className={classes.error}>Error</span>
          ) : (
            <span className={classes.ok}>OK</span>
          )}
        </div>

        <div className={classes.statusRow}>
          <span className={classes.statusLabel}>Last fetch:</span>
          <span className={classes.value}>
            {lastFetchedAt
              ? new Date(lastFetchedAt).toLocaleTimeString()
              : "—"}
          </span>
        </div>
      </div>

      <div className={classes.preview}>
        <p className={classes.previewLabel}>Latest Data Preview</p>

        <pre className={classes.jsonPreview}>
          {lastData ? JSON.stringify(lastData, null, 2) : "No data"}
        </pre>
      </div>
    </div>
  );
};

export default ApiModule;
