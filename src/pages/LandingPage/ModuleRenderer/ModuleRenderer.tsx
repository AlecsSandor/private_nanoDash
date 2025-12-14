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


import React from "react";
import { useSelector } from "react-redux";
import { ModuleType } from "../../../types/store";
import { componentMap } from "../../../contentComponents/componentMap";

interface ModuleRendererProps {
  module: ModuleType;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
  const Component = componentMap[module.type];

  // All API modules in the workspace
  const apiModules = useSelector((state: any) =>
    (state.modules.items || []).filter((m: ModuleType) => m.type === "api")
  );

  if (!Component) return null;

  /**
   * Start with literal props from Redux
   */
  const resolvedProps: Record<string, any> = {
    ...module.props,
  };

  /**
   * 🔗 Resolve bindings (ONLY for non-API modules)
   */
  if (module.type !== "api" && module.bindings) {
    Object.entries(module.bindings).forEach(([propKey, binding]) => {
      if (!binding) return;

      const apiModule = apiModules.find(m => m.id === binding.apiId);
      if (!apiModule) return;

      let value = apiModule.props?.lastData;
      if (value == null) return;

      // walk the path: ["prices", "0", "close"]
      for (const segment of binding.path) {
        if (value == null) return;
        value = value[segment];
      }

      resolvedProps[propKey] = value;
    });
  }

  return (
    <Component
      moduleId={module.id}   // ✅ explicit, never from bindings
      {...resolvedProps}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
