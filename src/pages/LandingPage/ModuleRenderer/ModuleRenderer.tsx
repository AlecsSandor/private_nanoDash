import React from "react";
import { ModuleType } from "../../../types/store";
import { componentMap } from "../../../contentComponents/componentMap";

interface ModuleRendererProps {
  module: ModuleType;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
  const Component = componentMap[module.type];

  if (!Component) {
    return <div></div>;
  }

  return (
    <Component
    moduleId={module.id} 
      {...module.props}   // dynamic props from Redux state
      style={{ width: "100%", height: "100%" }}
    />
  );
};
