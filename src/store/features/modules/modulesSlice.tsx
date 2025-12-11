import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModuleType } from "../../../types/store";

interface ModulesState {
  items: ModuleType[];
}

const initialState: ModulesState = {
  items: [
  { id: "1", x: 0, y: 0, width: 5, height: 5, title: "", subtitle: "", type: "none" },
  { id: "2", x: 250, y: 0, width: 2, height: 2, title: "", subtitle: "", type: "bar" },
  { id: "3", x: 0, y: 200, width: 2, height: 2, title: "", subtitle: "", type: "line" },
  { id: "4", x: 350, y: 200, width: 2, height: 2, title: "", subtitle: "", type: "area" },
  { id: "5", x: 0, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "donut" },
  { id: "6", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "bubble" },
  { id: "7", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "radial" },
  { id: "8", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "none" },
  { id: "9", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "barStatCard" },
  { id: "10", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "segmentedStatCard" },
  { id: "11", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "waveformStatCard" },
  { id: "12", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "heatmap" },
  { id: "13", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "timeline" },
  { id: "14", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "candle" },
  { id: "15", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "summaryCard" },
  { id: "16", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "dotMatrixImage" },
  { id: "17", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "infoCard" },
]
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    updateModulePosition(state, action: PayloadAction<{ id: string, x: number, y: number }>) {
      const module = state.items.find((m) => m.id === action.payload.id);
      if (module) {
        module.x = action.payload.x;
        module.y = action.payload.y;
      }
    },
    updateModuleSize(state, action: PayloadAction<{ id: string, width: number, height: number }>) {
      const module = state.items.find((m) => m.id === action.payload.id);
      if (module) {
        module.width = action.payload.width;
        module.height = action.payload.height;
      }
    },
    addModule(state, action: PayloadAction<ModuleType>) {
      state.items.push(action.payload);
    },
    removeModule(state, action: PayloadAction<string>) {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    duplicateModule(state, action: PayloadAction<{ id: string; x: number; y: number }>) {
      const original = state.items.find(m => m.id === action.payload.id);
      if (!original) return;

      const duplicated = {
        ...original,
        id: crypto.randomUUID(),
        x: action.payload.x,
        y: action.payload.y,
      };

      state.items.push(duplicated);
    },
  },
});

export const { updateModulePosition, updateModuleSize, addModule, removeModule, duplicateModule } = modulesSlice.actions;
export default modulesSlice.reducer;
