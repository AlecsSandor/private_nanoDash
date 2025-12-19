import React, { useMemo, useEffect } from "react";
import classes from "./styles.module.scss";
import { ParserModuleProps } from "../../types/store";
import { useDispatch, useSelector } from "react-redux";
import { updateModuleProps } from "../../store/features/modules/modulesSlice";

interface ParserModuleFullProps extends ParserModuleProps {
  moduleId: string;
}

const ParserModule: React.FC<ParserModuleFullProps> = ({
  moduleId,
  sourceModuleId,
  schema,
  lastData,
  lastParseError
}) => {
  const dispatch = useDispatch();

  const modules = useSelector((state: any) => state.modules.items);
  const sourceModule = modules.find((m: any) => m.id === sourceModuleId);
  const inputData = sourceModule?.props?.lastData;

  const parsedData = useMemo(() => {
    if (!inputData || !schema) return null;

    try {
      // Example: array → array mapping
      if (schema.type === "array-map") {
        if (!Array.isArray(inputData)) return null;

        return inputData.map((row: any[]) => {
          const obj: any = {};
          for (const [key, index] of Object.entries(schema.fields)) {
            obj[key] = Number(row[index as number]);
          }
          return obj;
        });
      }

      return null;
    } catch (err: any) {
      dispatch(updateModuleProps({
        id: moduleId,
        key: "lastParseError",
        value: err.message || "Parse error"
      }));
      return null;
    }
  }, [inputData, schema]);

  // Persist output to redux
  useEffect(() => {
    dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: parsedData }));
  }, [parsedData]);

  return (
    <div className={classes.ParserModule}>
      <div className={classes.section}>
        <div className={classes.label}>Source</div>
        <div className={classes.value}>
          {sourceModule?.name || sourceModuleId || "—"}
        </div>
      </div>

      <div className={classes.preview}>
        <p className={classes.previewLabel}>Parsed Output</p>
        <pre className={classes.jsonPreview}>
          {parsedData ? JSON.stringify(parsedData, null, 2) : "No data"}
        </pre>
      </div>

      {lastParseError && (
        <div className={classes.error}>
          {lastParseError}
        </div>
      )}
    </div>
  );
};

export default ParserModule;
