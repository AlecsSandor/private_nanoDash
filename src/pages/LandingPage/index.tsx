import { useState } from "react";
import classes from "./styles.module.scss";
import { Module } from "../../components/Module";

export const LandingPage = () => {
  const initialModules = [
    { id: "1", x: 0, y: 0, width: 224, height: 168 },
    { id: "2", x: 250, y: 0, width: 168, height: 224 },
    { id: "3", x: 0, y: 200, width: 280, height: 112 },
    { id: "4", x: 350, y: 200, width: 168, height: 112 },
    { id: "5", x: 0, y: 350, width: 224, height: 168 },
    { id: "6", x: 250, y: 350, width: 168, height: 112 },
  ];

  const [modules, setModules] = useState(initialModules);

  const updateModulePosition = (id: string, x: number, y: number) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, x, y } : m
      )
    );
  };

  return (
    <div className={classes.LandingPage}>
      <div className={classes.AppHeader}>
        {modules.map((module) => (
          <Module
            key={module.id}
            id={module.id}
            position={{ x: module.x, y: module.y }}
            width={module.width}
            height={module.height}
            others={modules.filter((m) => m.id !== module.id)}
            onPositionChange={updateModulePosition}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
