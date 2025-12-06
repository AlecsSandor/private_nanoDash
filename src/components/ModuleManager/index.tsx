import React, { createContext, useContext, useState, useCallback } from "react";

export interface ModuleData {
  id: string;
  x: number;
  y: number;
}

interface ModuleManagerContextType {
  modules: ModuleData[];
  register: (id: string) => void;
  unregister: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  finalizeDrag: (id: string, x: number, y: number) => void;
}

const ModuleManagerContext = createContext<ModuleManagerContextType>(null!);

export const useModuleManager = () => useContext(ModuleManagerContext);

const GRID = 56;

export const ModuleManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleData[]>([]);

  const register = (id: string) => {
    setModules(prev => [...prev, { id, x: 0, y: 0 }]);
  };

  const unregister = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const updatePosition = (id: string, x: number, y: number) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, x, y } : m))
    );
  };

  const finalizeDrag = (id: string, x: number, y: number) => {
    const snappedX = Math.round(x / GRID) * GRID;
    const snappedY = Math.round(y / GRID) * GRID;

    // Determine target index
    const sorted = [...modules].sort((a, b) => a.x - b.x);
    const draggedIndex = sorted.findIndex(m => m.id === id);

    let targetIndex = draggedIndex;

    for (let i = 0; i < sorted.length; i++) {
      if (snappedX < sorted[i].x) {
        targetIndex = i;
        break;
      }
      if (i === sorted.length - 1) targetIndex = sorted.length;
    }

    // Reinsert
    const newOrder = sorted.filter(m => m.id !== id);
    newOrder.splice(targetIndex, 0, { id, x: snappedX, y: snappedY });

    // Recompute new positions in line
    const finalLayout = newOrder.map((m, i) => ({
      id: m.id,
      x: i * GRID,
      y: snappedY
    }));

    setModules(finalLayout);
  };

  return (
    <ModuleManagerContext.Provider
      value={{ modules, register, unregister, updatePosition, finalizeDrag }}
    >
      {children}
    </ModuleManagerContext.Provider>
  );
};
