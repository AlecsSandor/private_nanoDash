import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModuleType } from "../../../types/store";
import { componentRegistry } from "../../../contentComponents/componentMap";

interface ModulesState {
  items: ModuleType[];
}

interface BindingPayload {
  id: string;        // module id
  prop: string;      // prop name
  apiId: string | null;
  path: (string | number)[];   // JSON path in lastData
}

const initialState: ModulesState = {
  items: [
    // { id: "1", x: 0, y: 0, width: 5, height: 5, title: "", subtitle: "", type: "none", props: {} },
    // { id: "2", x: 250, y: 0, width: 2, height: 2, title: "", subtitle: "", type: "bar", props: { values: [], barCount: 8, maxHeight: 100, barColor: "hsl(64, 85%, 59%)", animate: true } },
    // { id: "3", x: 0, y: 200, width: 2, height: 2, title: "", subtitle: "", type: "line", props: { values: [], pointCount: 12, maxValue: undefined, lineColor: "hsl(64, 85%, 59%)", showDots: true, showGrid: true, animate: true } },
    // { id: "4", x: 350, y: 200, width: 2, height: 2, title: "", subtitle: "", type: "area", props: { values: [], pointCount: 12, maxValue: undefined, fillColor: "hsl(64, 85%, 59%)", strokeColor: "hsl(64, 85%, 59%)", showGrid: true, animate: true } },
    // { id: "5", x: 0, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "donut", props: { values: [], colors: ["hsl(64, 85%, 59%)", "hsl(180, 70%, 50%)", "hsl(280, 70%, 60%)", "hsl(340, 70%, 55%)", "hsl(30, 80%, 55%)"], innerRadius: 25, centerLabel: undefined, centerValue: undefined, animate: true } },
    // { id: "6", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "bubble", props: { data: undefined, bubbleCount: 15, color: "hsl(64, 85%, 59%)", showGrid: true, animate: true } },
    // { id: "7", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "radial", props: { value: 75, maxValue: 100, size: undefined, strokeWidth: 8, color: "hsl(64, 85%, 59%)", trackColor: "hsl(0, 0%, 20%)", showValue: true, animate: true } },
    // { id: "8", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "none", props: {} },
    // { id: "9", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "barStatCard", props: { title: "Sales Report", value: "$9,134", change: 2.5, subtitle: "Avg. score $185,301", values: [], barCount: 12, accentColor: "hsl(80, 70%, 50%)", variant: "default", barShape: "rounded", size: "md", layout: "vertical", animate: true } },
    // { id: "10", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "segmentedStatCard", props: { title: "Sales Report", value: "$9,134", change: 2.5, subtitle: "Avg. score $185,301", rows: [80, 60, 40, 100], segmentsPerRow: 8, accentColor: "hsl(100, 70%, 50%)", inactiveColor: "hsl(0, 0%, 25%)", variant: "default", segmentShape: "rounded", size: "md", animate: true } },
    // { id: "11", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "waveformStatCard", props: { title: "Sales Report", value: "$9,134", change: 2.5, subtitle: "Avg. score $185,301", values: [], barCount: 24, accentColor: "hsl(150, 60%, 45%)", variant: "default", barShape: "rounded", size: "md", animate: true } },
    // { id: "12", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "heatmap", props: { data: undefined, rows: 7, cols: 12, colors: ["hsl(0, 0%, 15%)", "hsl(64, 60%, 40%)", "hsl(64, 85%, 59%)"], animate: true } },
    // { id: "13", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "timeline", props: { events: undefined, lineColor: "hsl(0, 0%, 30%)", dotColor: "hsl(64, 85%, 59%)", animate: true } },
    // { id: "14", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "candle", props: { data: undefined, candleCount: 20, upColor: "hsl(140, 70%, 45%)", downColor: "hsl(0, 70%, 50%)", animate: true } },
    // { id: "15", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "summaryCard", props: { dayLabel: "Fri", date: "January 17 2024", content: "Good morning! You have a productive day ahead.", showIndicator: true, indicatorColor: "hsl(0, 70%, 50%)", variant: "default", cornerStyle: "rounded", size: "md", maxHeight: 200 } },
    // { id: "16", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "dotMatrixImage", props: { imageSrc: "https://cdn.pixabay.com/photo/2014/11/21/03/26/neist-point-540119_1280.jpg", dotSpacing: 7, dotSize: 4, dotStyle: "square", backgroundColor: "hsl(60, 10%, 85%)" } },
    // { id: "17", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "infoCard", props: { title: "Info", value: "Value", subtitle: "Subtitle", icon: undefined, accentColor: "hsl(64, 85%, 59%)", variant: "default", size: "md", animate: true } },
    // { id: "18", x: 250, y: 350, width: 2, height: 2, title: "", subtitle: "", type: "gauge", props: { value: 65, minValue: 0, maxValue: 100, colors: ["hsl(0, 70%, 55%)", "hsl(40, 80%, 55%)", "hsl(64, 85%, 59%)"], label: undefined, animate: true } },
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
    updateModuleProps(state, action) {
      const { id, key, value } = action.payload;

      const mod = state.items.find((m) => m.id === id);
      if (mod) {
        mod.props = { ...mod.props, [key]: value };
      }
    },
    updateModuleType: (state, action) => {
      const { id, type } = action.payload;
      const mod = state.items.find((m) => m.id === id);

      if (mod) {
        mod.type = type;

        const defaults = componentRegistry[type]?.defaultProps || {};
        mod.props = { ...defaults };
      }
    },
    updateModuleBinding: (state, action: PayloadAction<BindingPayload>) => {
      const { id, prop, apiId, path } = action.payload;
      const module = state.items.find((m) => m.id === id);
      if (!module) return;

      if (!module.bindings) module.bindings = {};

      if (!apiId) {
        // remove binding if null
        delete module.bindings[prop];
      } else {
        module.bindings[prop] = { apiId, path };
      }
    },
  },
});

export const { updateModulePosition, updateModuleSize, addModule, removeModule, duplicateModule, updateModuleProps, updateModuleType, updateModuleBinding } = modulesSlice.actions;
export default modulesSlice.reducer;
