// import React, { useMemo, useEffect } from "react";
// import classes from "./styles.module.scss";
// import { ParserModuleProps } from "../../types/store";
// import { useDispatch, useSelector } from "react-redux";
// import { updateModuleProps } from "../../store/features/modules/modulesSlice";

// interface ParserModuleFullProps extends ParserModuleProps {
//   moduleId: string;
// }

// const ParserModule: React.FC<ParserModuleFullProps> = ({
//   moduleId,
//   sourceModuleId,
//   schema,
//   lastData,
//   lastParseError
// }) => {
//   const dispatch = useDispatch();

//   const modules = useSelector((state: any) => state.modules.items);
//   const sourceModule = modules.find((m: any) => m.id === sourceModuleId);
//   const inputData = sourceModule?.props?.lastData;

//   const parsedData = useMemo(() => {
//     if (!inputData || !schema) return null;

//     try {
//       // Example: array → array mapping
//       if (schema.type === "array-map") {
//         if (!Array.isArray(inputData)) return null;

//         return inputData.map((row: any[]) => {
//           const obj: any = {};
//           for (const [key, index] of Object.entries(schema.fields)) {
//             obj[key] = Number(row[index as number]);
//           }
//           return obj;
//         });
//       }

//       return null;
//     } catch (err: any) {
//       dispatch(updateModuleProps({
//         id: moduleId,
//         key: "lastParseError",
//         value: err.message || "Parse error"
//       }));
//       return null;
//     }
//   }, [inputData, schema]);

//   // Persist output to redux
//   useEffect(() => {
//     dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: parsedData }));
//   }, [parsedData]);

//   return (
//     <div className={classes.ParserModule}>
//       <div className={classes.section}>
//         <div className={classes.label}>Source</div>
//         <div className={classes.value}>
//           {sourceModule?.name || sourceModuleId || "—"}
//         </div>
//       </div>

//       <div className={classes.preview}>
//         <p className={classes.previewLabel}>Parsed Output</p>
//         <pre className={classes.jsonPreview}>
//           {parsedData ? JSON.stringify(parsedData, null, 2) : "No data"}
//         </pre>
//       </div>

//       {lastParseError && (
//         <div className={classes.error}>
//           {lastParseError}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ParserModule;







//############### USE THIS
import React, { useEffect } from "react";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateModuleProps } from "../../store/features/modules/modulesSlice";
import { ParserModuleProps } from "../../types/store";

interface Props extends ParserModuleProps {
  moduleId: string;
}

const ParserModule: React.FC<Props> = ({
  moduleId,
  sourceModuleId,
  schema,
  lastData,
  lastParseError
}) => {
  const dispatch = useDispatch();
  const modules = useSelector((s: any) => s.modules.items);

  const source = modules.find((m: any) => m.id === sourceModuleId);
  const inputData = source?.props?.lastData;

  let parsedData = {}

  useEffect(() => {
    if (!inputData || !schema) return;

    try {
      let output = inputData;

      if (schema.type === "array-map") {
        output = inputData.map((row: any[]) => {
          const obj: any = {};
          for (const key in schema.fields) {
            const index = schema.fields[key] as number;
            let val = row[index];
            if (schema.castToNumber) val = Number(val);
            obj[key] = val;
          }
          return obj;
        });
      }

      if (schema.type === "object-map") {
        const resolve = (obj: any, path: any[]) =>
          path.reduce((a, k) => (a == null ? undefined : a[k]), obj);

        const result: any = {};
        for (const key in schema.fields) {
          result[key] = resolve(inputData, schema.fields[key]);
        }
        output = result;
        parsedData = output
      }

      dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: output }));
      dispatch(updateModuleProps({ id: moduleId, key: "lastParseError", value: null }));
      dispatch(updateModuleProps({ id: moduleId, key: "lastParsedAt", value: Date.now() }));
    } catch (err: any) {
      dispatch(updateModuleProps({
        id: moduleId,
        key: "lastParseError",
        value: err.message || "Parse error",
      }));
    }
  }, [inputData, schema]);

    return (
    <div className={classes.ParserModule}>
      <div className={classes.section}>
        <div className={classes.label}>Source</div>
        <div className={classes.value}>
          {sourceModuleId || "—"}
        </div>
      </div>

      <div className={classes.preview}>
        <p className={classes.previewLabel}>Parsed Output</p>
        <pre className={classes.jsonPreview}>
          {lastData ? JSON.stringify(lastData, null, 2) : "No data"}
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






// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateModuleProps } from "../../store/features/modules/modulesSlice";
// import { ParserModuleProps } from "../../types/store";

// type Path = (string | number)[];

// interface BaseSchema {
//   root?: Path;
// }

// interface ArrayMapSchema extends BaseSchema {
//   type: "array-map";
//   fields: Record<string, number>;
//   castToNumber?: boolean;
//   limit?: number;
//   mode?: "each"; // future-proofing
// }

// interface ObjectMapSchema extends BaseSchema {
//   type: "object-map";
//   fields: Record<string, Path>;
//   mode?: "each"; // if root points to an array
// }

// type Schema = ArrayMapSchema | ObjectMapSchema;

// interface Props extends ParserModuleProps {
//   moduleId: string;
//   schema?: Schema;
// }

// const ParserModule: React.FC<Props> = ({ moduleId, sourceModuleId, schema }) => {
//   const dispatch = useDispatch();
//   const modules = useSelector((s: any) => s.modules.items);

//   const source = modules.find((m: any) => m.id === sourceModuleId);
//   const inputData = source?.props?.lastData;

//   // Utility to safely resolve a path in an object
//   const resolve = (obj: any, path: Path) =>
//     path.reduce((a, k) => (a == null ? undefined : a[k]), obj);

//   // Parse array-map
//   const parseArrayMap = (input: any[], schema: ArrayMapSchema) => {
//     if (!Array.isArray(input)) throw new Error("array-map expects an array");
//     const rows = schema.limit ? input.slice(0, schema.limit) : input;

//     return rows.map((row: any[]) => {
//       if (!Array.isArray(row)) throw new Error("array-map expects array of arrays");
//       const obj: any = {};
//       for (const key in schema.fields) {
//         let val = row[schema.fields[key]];
//         if (schema.castToNumber) val = Number(val);
//         obj[key] = val;
//       }
//       return obj;
//     });
//   };

//   // Parse object-map
//   const parseObjectMap = (input: any, schema: ObjectMapSchema) => {
//     const apply = (obj: any) => {
//       const result: any = {};
//       for (const key in schema.fields) {
//         result[key] = resolve(obj, schema.fields[key]);
//       }
//       return result;
//     };

//     if (schema.mode === "each") {
//       if (!Array.isArray(input)) throw new Error("object-map with mode 'each' expects array");
//       return input.map(apply);
//     }
//     return apply(input);
//   };

//   // General parse function
//   const parse = (data: any, schema: Schema) => {
//     const rootData = schema.root ? resolve(data, schema.root) : data;

//     switch (schema.type) {
//       case "array-map":
//         return parseArrayMap(rootData, schema);
//       case "object-map":
//         return parseObjectMap(rootData, schema);
//       default:
//         throw new Error("Unknown schema type");
//     }
//   };

//   useEffect(() => {
//     if (!inputData || !schema) return;

//     try {
//       const output = parse(inputData, schema);

//       dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: output }));
//       dispatch(updateModuleProps({ id: moduleId, key: "lastParseError", value: null }));
//       dispatch(updateModuleProps({ id: moduleId, key: "lastParsedAt", value: Date.now() }));
//     } catch (err: any) {
//       dispatch(
//         updateModuleProps({
//           id: moduleId,
//           key: "lastParseError",
//           value: err.message || "Parse error",
//         })
//       );
//     }
//   }, [inputData, schema]);

//   return null;
// };

// export default ParserModule;






// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateModuleProps } from "../../store/features/modules/modulesSlice";
// import { ParserModuleProps } from "../../types/store";

// interface Props extends ParserModuleProps {
//   moduleId: string;
// }

// /**
//  * Safely resolves a nested path from an object
//  */
// const resolvePath = (obj: any, path?: (string | number)[]) => {
//   if (!path || path.length === 0) return obj;
//   return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
// };

// /**
//  * Core parsing logic
//  */
// const parseWithSchema = (inputData: any, schema: any) => {
//   if (!schema || !schema.type) return inputData;

//   switch (schema.type) {
//     case "array-map": {
//       if (!Array.isArray(inputData)) {
//         throw new Error("array-map expects an array of arrays");
//       }

//       return inputData.map((row: any[]) => {
//         const obj: any = {};
//         for (const key in schema.fields) {
//           const index = schema.fields[key] as number;
//           let value = row[index];
//           if (schema.castToNumber) value = Number(value);
//           obj[key] = value;
//         }
//         return obj;
//       });
//     }

//     case "object-map": {
//       const mapObject = (source: any) => {
//         const result: any = {};
//         for (const key in schema.fields) {
//           result[key] = resolvePath(source, schema.fields[key]);
//         }
//         return result;
//       };

//       if (schema.mode === "each") {
//         if (!Array.isArray(inputData)) {
//           throw new Error("object-map with mode:each expects an array");
//         }
//         return inputData.map(mapObject);
//       }

//       return mapObject(inputData);
//     }

//     case "passthrough": {
//       return resolvePath(inputData, schema.root);
//     }

//     default:
//       throw new Error(`Unsupported schema type: ${schema.type}`);
//   }
// };

// const ParserModule: React.FC<Props> = ({
//   moduleId,
//   sourceModuleId,
//   schema,
// }) => {
//   const dispatch = useDispatch();
//   const modules = useSelector((s: any) => s.modules.items);

//   const sourceModule = modules.find((m: any) => m.id === sourceModuleId);
//   const inputData = sourceModule?.props?.lastData;

//   useEffect(() => {
//     if (!inputData || !schema) return;

//     try {
//       const output = parseWithSchema(inputData, schema);

//       dispatch(updateModuleProps({ id: moduleId, key: "lastData", value: output }));
//       dispatch(updateModuleProps({ id: moduleId, key: "lastParseError", value: null }));
//       dispatch(updateModuleProps({ id: moduleId, key: "lastParsedAt", value: Date.now() }));
//     } catch (err: any) {
//       dispatch(
//         updateModuleProps({
//           id: moduleId,
//           key: "lastParseError",
//           value: err.message || "Parse error",
//         })
//       );
//     }
//   }, [inputData, schema, moduleId, dispatch]);

//   return null;
// };

// export default ParserModule;
