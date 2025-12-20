// import React from "react";
// import { ModuleType } from "../../../types/store";
// import { componentMap } from "../../../contentComponents/componentMap";

// interface ModuleRendererProps {
//   module: ModuleType;
// }

// export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
//   const Component = componentMap[module.type];

//   if (!Component) {
//     return <div></div>;
//   }

//   return (
//     <Component
//     moduleId={module.id} 
//       {...module.props}   // dynamic props from Redux state
//       style={{ width: "100%", height: "100%" }}
//     />
//   );
// };


// import React from "react";
// import { useSelector } from "react-redux";
// import { ModuleType } from "../../../types/store";
// import { componentMap } from "../../../contentComponents/componentMap";

// interface ModuleRendererProps {
//   module: ModuleType;
// }

// export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
//   const Component = componentMap[module.type];

//   // All API modules in the workspace
//   const apiModules = useSelector((state: any) =>
//     (state.modules.items || []).filter((m: ModuleType) => m.type === "api")
//   );

//   if (!Component) return null;

//   /**
//    * Start with literal props from Redux
//    */
//   const resolvedProps: Record<string, any> = {
//     ...module.props,
//   };

//   /**
//    * 🔗 Resolve bindings (ONLY for non-API modules)
//    */
//   if (module.type !== "api" && module.bindings) {
//     Object.entries(module.bindings).forEach(([propKey, binding]) => {
//       if (!binding) return;

//       const apiModule = apiModules.find(m => m.id === binding.apiId);
//       if (!apiModule) return;

//       let value = apiModule.props?.lastData;
//       if (value == null) return;

//       // walk the path: ["prices", "0", "close"]
//       for (const segment of binding.path) {
//         if (value == null) return;
//         value = value[segment];
//       }

//       resolvedProps[propKey] = value;
//     });
//   }

//   return (
//     <Component
//       moduleId={module.id}   // ✅ explicit, never from bindings
//       {...resolvedProps}
//       style={{ width: "100%", height: "100%" }}
//     />
//   );
// };



import { useSelector } from "react-redux";
import { componentMap } from "../../../contentComponents/componentMap";
import { ModuleType } from "../../../types/store";

const resolveWithMap = (obj: any, path: (string | number)[]) => {
  let value = obj;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (key === "*") {
      const rest = path.slice(i + 1);
      if (!Array.isArray(value)) return undefined;
      return value.map(v => resolveWithMap(v, rest));
    }

    value = value?.[key as any];
  }

  return value;
};

// const sanitizePropValue = (value: any) => {
//   if (
//     value == null ||
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return value;
//   }

//   if (Array.isArray(value)) {
//     const isPrimitiveArray = value.every(
//       v =>
//         v == null ||
//         typeof v === "string" ||
//         typeof v === "number" ||
//         typeof v === "boolean"
//     );

//     return isPrimitiveArray ? value : undefined;
//   }

//   return undefined;
// };

const componentsAllowingObjectText = new Set([
  "textDisplay",
  "infoCard",
  "summaryCard",
  "barStatCard",
  "segmentedStatCard",
  "waveformStatCard"
]);

const isPlainObject = (v: any) =>
  Object.prototype.toString.call(v) === "[object Object]";

const sanitizePropValue = (value: any, moduleType: any) => {
  // primitives
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  // arrays (allow arrays of objects)
  if (Array.isArray(value)) {
    const isSafeArray = value.every(
      v =>
        v == null ||
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean" ||
        (isPlainObject(v) && !componentsAllowingObjectText.has(moduleType)) // block objects not allowed in TextDisplay
    );

    return isSafeArray ? value : undefined;
  }

  // // plain objects (ONLY allowed if explicitly bound)
  // if (isPlainObject(value)) {
  //   return value;
  // }

  if (isPlainObject(value)) {
  return undefined; // block objects entirely
}

  // everything else is unsafe
  return undefined;
};

export const ModuleRenderer: React.FC<{ module: ModuleType }> = ({ module }) => {
  const Component = componentMap[module.type];
  const modules = useSelector((state: any) => state.modules.items);

  if (!Component) return null;

  const resolvedProps = { ...module.props };

  if (module.bindings) {
    Object.entries(module.bindings).forEach(([prop, binding]) => {
      if (!binding) return;

      const apiModule = modules.find((m: any) => m.id === binding.apiId);
      const apiData = apiModule?.props?.lastData;
      if (!apiData) return;

      const rawValue = resolveWithMap(apiData, binding.path);
      const safeValue = sanitizePropValue(rawValue, module.type);
      console.log(safeValue)
      if (safeValue !== undefined) {
        resolvedProps[prop] = safeValue;
      } else {
        // optional: dev warning
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[ModuleRenderer] Unsafe value for prop "${prop}" ignored`,
            rawValue
          );
        }
      }
    });
  }

  return (
    <Component
      moduleId={module.id}
      {...resolvedProps}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
