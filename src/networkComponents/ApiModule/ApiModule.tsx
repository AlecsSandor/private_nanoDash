import React from "react";
import classes from "./styles.module.scss";
import { ApiModuleProps } from "../../types/store";

interface ApiModuleFullProps extends ApiModuleProps {
  // optional callback for fetching
  onFetch?: () => void;
}

const ApiModule: React.FC<ApiModuleFullProps> = ({
  api,
  status,
  lastData,
  onFetch,
}) => {
  return (
    <div className={classes.ApiModule}>

      <div className={classes.section}>
        <div className={classes.label}>URL</div>
        <div className={classes.value}>{api.url || "—"}</div>
      </div>

      <div className={classes.sectionRow}>
        <div className={classes.section}>
          <div className={classes.label}>Method</div>
          <div className={classes.value}>{api.method}</div>
        </div>

        <button className={classes.fetchButton} onClick={onFetch}>
          Fetch
        </button>
      </div>

      <div className={classes.statusBox}>
        <div className={classes.statusRow}>
          <span className={classes.statusLabel}>Status:</span>
          {status?.isFetching ? (
            <span className={classes.loading}>Fetching…</span>
          ) : status?.lastFetchError ? (
            <span className={classes.error}>Error</span>
          ) : (
            <span className={classes.ok}>OK</span>
          )}
        </div>

        <div className={classes.statusRow}>
          <span className={classes.statusLabel}>Last fetch:</span>
          <span className={classes.value}>
            {status?.lastFetchedAt
              ? new Date(status.lastFetchedAt).toLocaleTimeString()
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
