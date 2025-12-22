// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { closeSidePanel } from "../../store/features/ui/uiSlice";
// import {
//   updateModulePosition,
//   updateModuleSize,
//   updateModuleProps,
//   updateModuleType
// } from "../../store/features/modules/modulesSlice";
// import { componentMap } from "../../contentComponents/componentMap";
// import classes from "./styles.module.scss";

// export const SidePanel = () => {
//   const dispatch = useDispatch();

//   const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
//   const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
//   const modules = useSelector((state: any) => state.modules.items || []);
//   const selectedModule = modules.find((m: any) => m.id === selectedModuleId);

//   // ---- Stable local state for position/size ----
//   const [tempX, setTempX] = React.useState(0);
//   const [tempY, setTempY] = React.useState(0);
//   const [tempW, setTempW] = React.useState(0);
//   const [tempH, setTempH] = React.useState(0);

//   React.useEffect(() => {
//     if (!selectedModule) return;
//     setTempX(selectedModule.x);
//     setTempY(selectedModule.y);
//     setTempW(selectedModule.width);
//     setTempH(selectedModule.height);
//   }, [selectedModuleId]);

//   if (!selectedModule) {
//     return (
//       <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
//         <div className={classes.header}>
//           <h2>Module Settings</h2>
//         </div>
//         <div className={classes.placeholder}>Select a module to edit</div>
//       </div>
//     );
//   }

//    const propsObj = selectedModule.props || {};

//   // ---- Generic prop updater ----
//   const updateProp = (key: string, value: any) => {
//     dispatch(updateModuleProps({ id: selectedModule.id, key, value }));
//   };

//   // ---- AUTOMATIC PROP INPUT RENDERING ----
//   const renderPropField = (key: string, value: any) => {
//     if (typeof value === "number") {
//       return (
//         <input
//           type="number"
//           value={value}
//           onChange={(e) => updateProp(key, Number(e.target.value))}
//         />
//       );
//     }

//     if (typeof value === "boolean") {
//       return (
//         <input
//           type="checkbox"
//           checked={value}
//           onChange={(e) => updateProp(key, e.target.checked)}
//         />
//       );
//     }

//     if (typeof value === "string") {
//       return (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => updateProp(key, e.target.value)}
//         />
//       );
//     }

//     return (
//       <textarea
//         value={JSON.stringify(value, null, 2)}
//         onChange={(e) => {
//           try {
//             updateProp(key, JSON.parse(e.target.value));
//           } catch {
//             // ignore invalid JSON
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
//       <div className={classes.header}>
//         <h2>Module Settings</h2>
//         <button
//           className={classes.closeButton}
//           onClick={() => dispatch(closeSidePanel())}
//         >
//           ✕
//         </button>
//       </div>

//       <div className={classes.content}>

//         {/* ===== POSITIONS ===== */}
//         <div className={classes.group}>
//           <label>Position X</label>
//           <input
//             type="number"
//             value={tempX}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempX(val);
//               dispatch(updateModulePosition({ id: selectedModule.id, x: val, y: tempY }));
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Position Y</label>
//           <input
//             type="number"
//             value={tempY}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempY(val);
//               dispatch(updateModulePosition({ id: selectedModule.id, x: tempX, y: val }));
//             }}
//           />
//         </div>

//         {/* WIDTH + HEIGHT */}
//         <div className={classes.group}>
//           <label>Width</label>
//           <input
//             type="number"
//             value={tempW}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempW(val);
//               dispatch(updateModuleSize({ id: selectedModule.id, width: val, height: tempH }));
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Height</label>
//           <input
//             type="number"
//             value={tempH}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempH(val);
//               dispatch(updateModuleSize({ id: selectedModule.id, width: tempW, height: val }));
//             }}
//           />
//         </div>

//         {/* ==============================
//               MODULE TYPE SELECTOR
//             ============================== */}
//         <div className={classes.group}>
//           <label>Component Type</label>
//           <select
//             value={selectedModule.type}
//             onChange={(e) =>
//               dispatch(updateModuleType({ id: selectedModule.id, type: e.target.value }))
//             }
//           >
//             {Object.keys(componentMap).map((typeKey) => (
//               <option key={typeKey} value={typeKey}>
//                 {typeKey}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ==========================================
//               API MODULE SETTINGS (flat props)
//            ========================================== */}
//         {selectedModule.type === "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>API Settings</h3>

//             <div className={classes.group}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 value={selectedModule.name ?? ""}
//                 onChange={(e) => updateProp("name", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>URL</label>
//               <input
//                 type="text"
//                 value={selectedModule.url ?? ""}
//                 onChange={(e) => updateProp("url", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Method</label>
//               <select
//                 value={selectedModule.method ?? "GET"}
//                 onChange={(e) => updateProp("method", e.target.value)}
//               >
//                 <option>GET</option>
//                 <option>POST</option>
//                 <option>PUT</option>
//                 <option>PATCH</option>
//                 <option>DELETE</option>
//               </select>
//             </div>

//             {(selectedModule.method ?? "GET") !== "GET" && (
//               <div className={classes.group}>
//                 <label>Body (JSON)</label>
//                 <textarea
//                   value={selectedModule.body ? JSON.stringify(selectedModule.body, null, 2) : ""}
//                   onChange={(e) => {
//                     try {
//                       updateProp("body", JSON.parse(e.target.value));
//                     } catch {}
//                   }}
//                 />
//               </div>
//             )}

//             <div className={classes.group}>
//               <label>Headers (JSON)</label>
//               <textarea
//                 value={selectedModule.headers ? JSON.stringify(selectedModule.headers, null, 2) : "{}"}
//                 onChange={(e) => {
//                   try {
//                     updateProp("headers", JSON.parse(e.target.value));
//                   } catch {}
//                 }}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={!!selectedModule.enabled}
//                   onChange={(e) => updateProp("enabled", e.target.checked)}
//                 />
//                 Enable Automatic Refresh
//               </label>
//             </div>

//             <div className={classes.group}>
//               <label>Refresh Interval (ms)</label>
//               <input
//                 type="number"
//                 value={selectedModule.refreshIntervalMs ?? 0}
//                 onChange={(e) => updateProp("refreshIntervalMs", Number(e.target.value))}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Transform Path</label>
//               <input
//                 type="text"
//                 value={selectedModule.transformPath ?? ""}
//                 onChange={(e) => updateProp("transformPath", e.target.value)}
//               />
//             </div>

//             <div className={classes.separator} />
//           </>
//         )}

//         {/* ==========================================
//               GENERIC MODULE PROPS (NOT API)
//            ========================================== */}
//         {selectedModule.type !== "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>Component Props</h3>
//             {Object.keys(propsObj).map((key) => (
//               <div className={classes.group} key={key}>
//                 <label>{key}</label>
//                 {renderPropField(key, propsObj[key])}
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SidePanel;








// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { closeSidePanel } from "../../store/features/ui/uiSlice";
// import {
//   updateModulePosition,
//   updateModuleSize,
//   updateModuleProps,
//   updateModuleType,
//   updateModuleBinding
// } from "../../store/features/modules/modulesSlice";
// import { componentMap } from "../../contentComponents/componentMap";
// import classes from "./styles.module.scss";

// // const resolvePath = (obj: any, path: (string | number)[]) => {
// //   return path.reduce((acc, key) => {
// //     if (acc == null) return undefined;
// //     return acc[key as any];
// //   }, obj);
// // };

// const resolvePath = (obj: any, path: (string | number)[]): any => {
//   let current = obj;

//   for (let i = 0; i < path.length; i++) {
//     const key = path[i];

//     if (current == null) return undefined;

//     // ⭐ ARRAY MAP TOKEN
//     if (key === "*") {
//       const rest = path.slice(i + 1);
//       if (!Array.isArray(current)) return undefined;
//       return current.map((item) => resolvePath(item, rest));
//     }

//     current = current[key as any];
//   }

//   return current;
// };

// const getValueType = (value: any) => {
//   if (Array.isArray(value)) return "array";
//   if (value !== null && typeof value === "object") return "object";
//   return "primitive";
// };

// interface JsonPathSelectorProps {
//   value: any;
//   path: (string | number)[];
//   onChange: (path: (string | number)[]) => void;
// }

// const JsonPathSelector: React.FC<JsonPathSelectorProps> = ({
//   value,
//   path,
//   onChange,
// }) => {
//   const type = getValueType(value);

//   if (type === "primitive") return null;

//   if (type === "object") {
//     return (
//       <select
//         value={path[path.length - 1] ?? ""}
//         onChange={(e) =>
//           onChange([...path.slice(0, -1), e.target.value])
//         }
//       >
//         <option value="">— select key —</option>
//         {Object.keys(value).map((k) => (
//           <option key={k} value={k}>
//             {k}
//           </option>
//         ))}
//       </select>
//     );
//   }

//   // if (type === "array") {
//   //   const current = path[path.length - 1];

//   //   return (
//   //     <select
//   //       value={typeof current === "number" ? current : "__all__"}
//   //       onChange={(e) => {
//   //         if (e.target.value === "__all__") {
//   //           onChange(path.slice(0, -1));
//   //         } else {
//   //           onChange([...path.slice(0, -1), Number(e.target.value)]);
//   //         }
//   //       }}
//   //     >
//   //       <option value="__all__">— entire array —</option>
//   //       {value.map((_: any, i: number) => (
//   //         <option key={i} value={i}>
//   //           [{i}]
//   //         </option>
//   //       ))}
//   //     </select>
//   //   );
//   // }

//   if (type === "array") {
//     const current = path[path.length - 1];

//     return (
//       <select
//         value={current === "*" ? "*" : typeof current === "number" ? current : ""}
//         onChange={(e) => {
//           if (e.target.value === "*") {
//             onChange([...path.slice(0, -1), "*"]);
//           } else if (e.target.value === "__all__") {
//             onChange(path.slice(0, -1));
//           } else {
//             onChange([...path.slice(0, -1), Number(e.target.value)]);
//           }
//         }}
//       >
//         <option value="">— select —</option>
//         <option value="__all__">— entire array —</option>
//         <option value="*">— map each item —</option>

//         {value.map((_: any, i: number) => (
//           <option key={i} value={i}>
//             [{i}]
//           </option>
//         ))}
//       </select>
//     );
//   }


//   return null;
// };

// export const SidePanel = () => {
//   const dispatch = useDispatch();

//   const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
//   const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
//   const modules = useSelector((state: any) => state.modules.items || []);
//   const selectedModule = modules.find((m: any) => m.id === selectedModuleId);

//   const apiModules = modules.filter((m: any) => m.type === "api");

//   // ---- Stable local state for position/size ----
//   const [tempX, setTempX] = React.useState(0);
//   const [tempY, setTempY] = React.useState(0);
//   const [tempW, setTempW] = React.useState(0);
//   const [tempH, setTempH] = React.useState(0);

//   React.useEffect(() => {
//     if (!selectedModule) return;
//     setTempX(selectedModule.x);
//     setTempY(selectedModule.y);
//     setTempW(selectedModule.width);
//     setTempH(selectedModule.height);
//   }, [selectedModuleId]);

//   if (!selectedModule) {
//     return (
//       <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
//         <div className={classes.header}>
//           <h2>Module Settings</h2>
//         </div>
//         <div className={classes.placeholder}>Select a module to edit</div>
//       </div>
//     );
//   }

//   const propsObj = selectedModule.props || {};
//   const bindings = selectedModule.bindings || {};

//   // ---- Generic prop updater ----
//   const updateProp = (key: string, value: any) => {
//     dispatch(updateModuleProps({ id: selectedModule.id, key, value }));
//   };

//   // ---- Binding updater ----
//   const updateBinding = (propName: string, apiId: string | null, path: string[] = []) => {
//     dispatch(updateModuleBinding({ id: selectedModule.id, prop: propName, apiId, path }));
//   };

//   // ---- AUTOMATIC PROP INPUT RENDERING ----
//   const renderPropField = (key: string, value: any) => {
//     if (typeof value === "number") {
//       return (
//         <input
//           type="number"
//           value={value}
//           onChange={(e) => updateProp(key, Number(e.target.value))}
//         />
//       );
//     }

//     if (typeof value === "boolean") {
//       return (
//         <input
//           type="checkbox"
//           checked={value}
//           onChange={(e) => updateProp(key, e.target.checked)}
//         />
//       );
//     }

//     if (typeof value === "string") {
//       return (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => updateProp(key, e.target.value)}
//         />
//       );
//     }

//     return (
//       <textarea
//         value={JSON.stringify(value, null, 2)}
//         onChange={(e) => {
//           try {
//             updateProp(key, JSON.parse(e.target.value));
//           } catch {
//             // ignore invalid JSON
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
//       <div className={classes.header}>
//         <h2>Module Settings</h2>
//         <button
//           className={classes.closeButton}
//           onClick={() => dispatch(closeSidePanel())}
//         >
//           ✕
//         </button>
//       </div>

//       <div className={classes.content}>
//         {/* ===== POSITIONS ===== */}
//         <div className={classes.group}>
//           <label>Position X</label>
//           <input
//             type="number"
//             value={tempX}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempX(val);
//               dispatch(updateModulePosition({ id: selectedModule.id, x: val, y: tempY }));
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Position Y</label>
//           <input
//             type="number"
//             value={tempY}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempY(val);
//               dispatch(updateModulePosition({ id: selectedModule.id, x: tempX, y: val }));
//             }}
//           />
//         </div>

//         {/* WIDTH + HEIGHT */}
//         <div className={classes.group}>
//           <label>Width</label>
//           <input
//             type="number"
//             value={tempW}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempW(val);
//               dispatch(updateModuleSize({ id: selectedModule.id, width: val, height: tempH }));
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Height</label>
//           <input
//             type="number"
//             value={tempH}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempH(val);
//               dispatch(updateModuleSize({ id: selectedModule.id, width: tempW, height: val }));
//             }}
//           />
//         </div>

//         {/* ==============================
//               MODULE TYPE SELECTOR
//             ============================== */}
//         <div className={classes.group}>
//           <label>Component Type</label>
//           <select
//             value={selectedModule.type}
//             onChange={(e) =>
//               dispatch(updateModuleType({ id: selectedModule.id, type: e.target.value }))
//             }
//           >
//             {Object.keys(componentMap).map((typeKey) => (
//               <option key={typeKey} value={typeKey}>
//                 {typeKey}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ==========================================
//               API MODULE SETTINGS (flat props)
//            ========================================== */}
//         {selectedModule.type === "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>API Settings</h3>

//             <div className={classes.group}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 value={selectedModule.name ?? ""}
//                 onChange={(e) => updateProp("name", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>URL</label>
//               <input
//                 type="text"
//                 value={selectedModule.url ?? ""}
//                 onChange={(e) => updateProp("url", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Method</label>
//               <select
//                 value={selectedModule.method ?? "GET"}
//                 onChange={(e) => updateProp("method", e.target.value)}
//               >
//                 <option>GET</option>
//                 <option>POST</option>
//                 <option>PUT</option>
//                 <option>PATCH</option>
//                 <option>DELETE</option>
//               </select>
//             </div>

//             {(selectedModule.method ?? "GET") !== "GET" && (
//               <div className={classes.group}>
//                 <label>Body (JSON)</label>
//                 <textarea
//                   value={selectedModule.body ? JSON.stringify(selectedModule.body, null, 2) : ""}
//                   onChange={(e) => {
//                     try {
//                       updateProp("body", JSON.parse(e.target.value));
//                     } catch { }
//                   }}
//                 />
//               </div>
//             )}

//             <div className={classes.group}>
//               <label>Headers (JSON)</label>
//               <textarea
//                 value={selectedModule.headers ? JSON.stringify(selectedModule.headers, null, 2) : "{}"}
//                 onChange={(e) => {
//                   try {
//                     updateProp("headers", JSON.parse(e.target.value));
//                   } catch { }
//                 }}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={!!selectedModule.enabled}
//                   onChange={(e) => updateProp("enabled", e.target.checked)}
//                 />
//                 Enable Automatic Refresh
//               </label>
//             </div>

//             <div className={classes.group}>
//               <label>Refresh Interval (ms)</label>
//               <input
//                 type="number"
//                 value={selectedModule.refreshIntervalMs ?? 0}
//                 onChange={(e) => updateProp("refreshIntervalMs", Number(e.target.value))}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Transform Path</label>
//               <input
//                 type="text"
//                 value={selectedModule.transformPath ?? ""}
//                 onChange={(e) => updateProp("transformPath", e.target.value)}
//               />
//             </div>

//             <div className={classes.separator} />
//           </>
//         )}

//         {/* ==========================================
//               GENERIC MODULE PROPS (NOT API)
//            ========================================== */}
//         {selectedModule.type !== "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>Component Props</h3>
//             {Object.keys(propsObj).map((key) => {
//               const binding = bindings[key];

//               return (
//                 <div className={classes.group} key={key}>
//                   <label>{key}</label>
//                   {renderPropField(key, propsObj[key])}

//                   {/* API Binding */}
//                   <div className={classes.bindingRow}>
//                     <select
//                       value={binding?.apiId || ""}
//                       onChange={(e) => updateBinding(key, e.target.value || null, [])}
//                     >
//                       <option value="">— bind to API —</option>
//                       {apiModules.map(api => (
//                         <option key={api.id} value={api.id}>{api.name || api.id}</option>
//                       ))}
//                     </select>

//                     {binding?.apiId && (() => {
//                       const api = apiModules.find((m) => m.id === binding.apiId);
//                       const rootData = api?.props?.lastData;

//                       if (!rootData) return null;

//                       return (
//                         <div className={classes.pathSelectors}>
//                           {/* Existing path segments */}
//                           {binding.path.map((_, i) => {
//                             const subPath = binding.path.slice(0, i + 1);
//                             const valueAtPath = resolvePath(rootData, subPath);

//                             return (
//                               <JsonPathSelector
//                                 key={i}
//                                 value={valueAtPath}
//                                 path={subPath}
//                                 onChange={(newPath) =>
//                                   updateBinding(key, binding.apiId, newPath)
//                                 }
//                               />
//                             );
//                           })}

//                           {/* Add next level */}
//                           {(() => {
//                             const currentValue = resolvePath(rootData, binding.path);
//                             if (getValueType(currentValue) !== "primitive") {
//                               return (
//                                 <JsonPathSelector
//                                   value={currentValue}
//                                   path={[...binding.path, ""]}
//                                   onChange={(newPath) =>
//                                     updateBinding(key, binding.apiId, newPath)
//                                   }
//                                 />
//                               );
//                             }
//                             return null;
//                           })()}
//                         </div>
//                       );
//                     })()}


//                     {/* {binding?.apiId && (
//                       console.log("binding", apiModules[0].props.lastData),
//                       <select
//                         value={binding?.path?.[0] || ""}
//                         onChange={(e) => updateBinding(key, binding.apiId, [e.target.value])}
//                       >
//                         {Object.keys(apiModules.find(m => m.id === binding.apiId)?.props.lastData || {}).map(k => (
//                           <option key={k} value={k}>{k}</option>
//                         ))}
//                       </select>
//                     )} */}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SidePanel;





// import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { closeSidePanel } from "../../store/features/ui/uiSlice";
// import {
//   updateModulePosition,
//   updateModuleSize,
//   updateModuleProps,
//   updateModuleType,
//   updateModuleBinding,
// } from "../../store/features/modules/modulesSlice";
// import { componentMap } from "../../contentComponents/componentMap";
// import classes from "./styles.module.scss";

// const resolvePath = (obj: any, path: (string | number)[]) => {
//   return path.reduce((acc, key) => {
//     if (acc == null) return undefined;
//     return acc[key as any];
//   }, obj);
// };

// const getValueType = (value: any) => {
//   if (Array.isArray(value)) return "array";
//   if (value !== null && typeof value === "object") return "object";
//   return "primitive";
// };

// interface JsonPathSelectorProps {
//   value: any;
//   path: (string | number)[];
//   onChange: (path: (string | number)[]) => void;
// }

// const JsonPathSelector: React.FC<JsonPathSelectorProps> = ({
//   value,
//   path,
//   onChange,
// }) => {
//   const type = getValueType(value);

//   if (type === "primitive") return null;

//   if (type === "object") {
//     return (
//       <select
//         value={path[path.length - 1] ?? ""}
//         onChange={(e) =>
//           onChange([...path.slice(0, -1), e.target.value])
//         }
//       >
//         <option value="">— select key —</option>
//         {Object.keys(value).map((k) => (
//           <option key={k} value={k}>
//             {k}
//           </option>
//         ))}
//       </select>
//     );
//   }

//   if (type === "array") {
//     const current = path[path.length - 1];

//     return (
//       <select
//         value={typeof current === "number" ? current : "__all__"}
//         onChange={(e) => {
//           if (e.target.value === "__all__") {
//             onChange(path.slice(0, -1));
//           } else {
//             onChange([...path.slice(0, -1), Number(e.target.value)]);
//           }
//         }}
//       >
//         <option value="__all__">— entire array —</option>
//         {value.map((_: any, i: number) => (
//           <option key={i} value={i}>
//             [{i}]
//           </option>
//         ))}
//       </select>
//     );
//   }

//   return null;
// };

// export const SidePanel = () => {
//   const dispatch = useDispatch();

//   const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
//   const selectedModuleId = useSelector(
//     (state: any) => state.ui.selectedModuleId
//   );
//   const modules = useSelector((state: any) => state.modules.items || []);

//   const selectedModule = modules.find(
//     (m: any) => m.id === selectedModuleId
//   );

//   const apiModules = modules.filter((m: any) => m.type === "api");

//   // ---- Stable local state for position/size ----
//   const [tempX, setTempX] = React.useState(0);
//   const [tempY, setTempY] = React.useState(0);
//   const [tempW, setTempW] = React.useState(0);
//   const [tempH, setTempH] = React.useState(0);

//   React.useEffect(() => {
//     if (!selectedModule) return;

//     setTempX(selectedModule.x);
//     setTempY(selectedModule.y);
//     setTempW(selectedModule.width);
//     setTempH(selectedModule.height);
//   }, [selectedModuleId]);

//   if (!selectedModule) {
//     return (
//       <div
//         className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}
//       >
//         <div className={classes.header}>
//           <h2>Module Settings</h2>
//         </div>
//         <div className={classes.placeholder}>Select a module to edit</div>
//       </div>
//     );
//   }

//   const propsObj = selectedModule.props || {};
//   const bindings = selectedModule.bindings || {};

//   // ---- Generic prop updater ----
//   const updateProp = (key: string, value: any) => {
//     dispatch(updateModuleProps({ id: selectedModule.id, key, value }));
//   };

//   // ---- Binding updater ----
//   const updateBinding = (
//     propName: string,
//     apiId: string | null,
//     path: string[] = []
//   ) => {
//     dispatch(
//       updateModuleBinding({
//         id: selectedModule.id,
//         prop: propName,
//         apiId,
//         path,
//       })
//     );
//   };

//   // ---- AUTOMATIC PROP INPUT RENDERING ----
//   const renderPropField = (key: string, value: any) => {
//     if (typeof value === "number") {
//       return (
//         <input
//           type="number"
//           value={value}
//           onChange={(e) => updateProp(key, Number(e.target.value))}
//         />
//       );
//     }

//     if (typeof value === "boolean") {
//       return (
//         <input
//           type="checkbox"
//           checked={value}
//           onChange={(e) => updateProp(key, e.target.checked)}
//         />
//       );
//     }

//     if (typeof value === "string") {
//       return (
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => updateProp(key, e.target.value)}
//         />
//       );
//     }

//     return (
//       <textarea
//         value={JSON.stringify(value, null, 2)}
//         onChange={(e) => {
//           try {
//             updateProp(key, JSON.parse(e.target.value));
//           } catch {
//             // ignore invalid JSON
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <div
//       className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}
//     >
//       <div className={classes.header}>
//         <h2>Module Settings</h2>
//         <button
//           className={classes.closeButton}
//           onClick={() => dispatch(closeSidePanel())}
//         >
//           ✕
//         </button>
//       </div>

//       <div className={classes.content}>
//         {/* ===== POSITIONS ===== */}
//         <div className={classes.group}>
//           <label>Position X</label>
//           <input
//             type="number"
//             value={tempX}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempX(val);
//               dispatch(
//                 updateModulePosition({
//                   id: selectedModule.id,
//                   x: val,
//                   y: tempY,
//                 })
//               );
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Position Y</label>
//           <input
//             type="number"
//             value={tempY}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempY(val);
//               dispatch(
//                 updateModulePosition({
//                   id: selectedModule.id,
//                   x: tempX,
//                   y: val,
//                 })
//               );
//             }}
//           />
//         </div>

//         {/* WIDTH + HEIGHT */}
//         <div className={classes.group}>
//           <label>Width</label>
//           <input
//             type="number"
//             value={tempW}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempW(val);
//               dispatch(
//                 updateModuleSize({
//                   id: selectedModule.id,
//                   width: val,
//                   height: tempH,
//                 })
//               );
//             }}
//           />
//         </div>

//         <div className={classes.group}>
//           <label>Height</label>
//           <input
//             type="number"
//             value={tempH}
//             onChange={(e) => {
//               const val = Number(e.target.value);
//               setTempH(val);
//               dispatch(
//                 updateModuleSize({
//                   id: selectedModule.id,
//                   width: tempW,
//                   height: val,
//                 })
//               );
//             }}
//           />
//         </div>

//         {/* ============================== MODULE TYPE SELECTOR ============================== */}
//         <div className={classes.group}>
//           <label>Component Type</label>
//           <select
//             value={selectedModule.type}
//             onChange={(e) =>
//               dispatch(
//                 updateModuleType({
//                   id: selectedModule.id,
//                   type: e.target.value,
//                 })
//               )
//             }
//           >
//             {Object.keys(componentMap).map((typeKey) => (
//               <option key={typeKey} value={typeKey}>
//                 {typeKey}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ========================================== API MODULE SETTINGS (flat props) ========================================== */}
//         {selectedModule.type === "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>API Settings</h3>

//             <div className={classes.group}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 value={selectedModule.name ?? ""}
//                 onChange={(e) => updateProp("name", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>URL</label>
//               <input
//                 type="text"
//                 value={selectedModule.url ?? ""}
//                 onChange={(e) => updateProp("url", e.target.value)}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Method</label>
//               <select
//                 value={selectedModule.method ?? "GET"}
//                 onChange={(e) => updateProp("method", e.target.value)}
//               >
//                 <option>GET</option>
//                 <option>POST</option>
//                 <option>PUT</option>
//                 <option>PATCH</option>
//                 <option>DELETE</option>
//               </select>
//             </div>

//             {(selectedModule.method ?? "GET") !== "GET" && (
//               <div className={classes.group}>
//                 <label>Body (JSON)</label>
//                 <textarea
//                   value={
//                     selectedModule.body
//                       ? JSON.stringify(selectedModule.body, null, 2)
//                       : ""
//                   }
//                   onChange={(e) => {
//                     try {
//                       updateProp("body", JSON.parse(e.target.value));
//                     } catch {}
//                   }}
//                 />
//               </div>
//             )}

//             <div className={classes.group}>
//               <label>Headers (JSON)</label>
//               <textarea
//                 value={
//                   selectedModule.headers
//                     ? JSON.stringify(selectedModule.headers, null, 2)
//                     : "{}"
//                 }
//                 onChange={(e) => {
//                   try {
//                     updateProp("headers", JSON.parse(e.target.value));
//                   } catch {}
//                 }}
//               />
//             </div>

//             <div className={classes.group}>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={!!selectedModule.enabled}
//                   onChange={(e) =>
//                     updateProp("enabled", e.target.checked)
//                   }
//                 />
//                 Enable Automatic Refresh
//               </label>
//             </div>

//             <div className={classes.group}>
//               <label>Refresh Interval (ms)</label>
//               <input
//                 type="number"
//                 value={selectedModule.refreshIntervalMs ?? 0}
//                 onChange={(e) =>
//                   updateProp(
//                     "refreshIntervalMs",
//                     Number(e.target.value)
//                   )
//                 }
//               />
//             </div>

//             <div className={classes.group}>
//               <label>Transform Path</label>
//               <input
//                 type="text"
//                 value={selectedModule.transformPath ?? ""}
//                 onChange={(e) =>
//                   updateProp("transformPath", e.target.value)
//                 }
//               />
//             </div>

//             <div className={classes.separator} />
//           </>
//         )}

//         {/* ========================================== GENERIC MODULE PROPS (NOT API) ========================================== */}
//         {selectedModule.type !== "api" && (
//           <>
//             <h3 className={classes.sectionTitle}>Component Props</h3>

//             {Object.keys(propsObj).map((key) => {
//               const binding = bindings[key];

//               return (
//                 <div className={classes.group} key={key}>
//                   <label>{key}</label>
//                   {renderPropField(key, propsObj[key])}

//                   {/* API Binding */}
//                   <div className={classes.bindingRow}>
//                     <select
//                       value={binding?.apiId || ""}
//                       onChange={(e) =>
//                         updateBinding(key, e.target.value || null, [])
//                       }
//                     >
//                       <option value="">— bind to API —</option>
//                       {apiModules.map((api) => (
//                         <option key={api.id} value={api.id}>
//                           {api.name || api.id}
//                         </option>
//                       ))}
//                     </select>

//                     {binding?.apiId && (() => {
//                       const api = apiModules.find(
//                         (m) => m.id === binding.apiId
//                       );

//                       const rootData = api?.props?.lastData;
//                       if (!rootData) return null;

//                       return (
//                         <div className={classes.pathSelectors}>
//                           {/* Existing path segments */}
//                           {binding.path.map((_, i) => {
//                             const subPath = binding.path.slice(0, i + 1);
//                             const valueAtPath = resolvePath(
//                               rootData,
//                               subPath
//                             );

//                             return (
//                               <JsonPathSelector
//                                 key={i}
//                                 value={valueAtPath}
//                                 path={subPath}
//                                 onChange={(newPath) =>
//                                   updateBinding(
//                                     key,
//                                     binding.apiId,
//                                     newPath
//                                   )
//                                 }
//                               />
//                             );
//                           })}

//                           {/* Add next level */}
//                           {(() => {
//                             const currentValue = resolvePath(
//                               rootData,
//                               binding.path
//                             );

//                             if (
//                               getValueType(currentValue) !== "primitive"
//                             ) {
//                               return (
//                                 <JsonPathSelector
//                                   value={currentValue}
//                                   path={[...binding.path, ""]}
//                                   onChange={(newPath) =>
//                                     updateBinding(
//                                       key,
//                                       binding.apiId,
//                                       newPath
//                                     )
//                                   }
//                                 />
//                               );
//                             }

//                             return null;
//                           })()}
//                         </div>
//                       );
//                     })()}
//                   </div>
//                 </div>
//               );
//             })}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SidePanel;


//###########################################################################


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel } from "../../store/features/ui/uiSlice";
import {
  updateModulePosition,
  updateModuleSize,
  updateModuleProps,
  updateModuleType,
  updateModuleBinding,
} from "../../store/features/modules/modulesSlice";
import { componentMap } from "../../contentComponents/componentMap";
import classes from "./styles.module.scss";

// Resolve path with wildcard support
// "*" means "map over array and extract sub-path from each element"
const resolvePath = (obj: any, path: (string | number)[]): any => {
  let current = obj;

  for (let i = 0; i < path.length; i++) {
    if (current == null) return undefined;

    const key = path[i];

    if (key === "*") {
      // Wildcard: map over array and resolve remaining path for each element
      if (!Array.isArray(current)) return undefined;
      const remainingPath = path.slice(i + 1);
      if (remainingPath.length === 0) return current;
      return current.map((item) => resolvePath(item, remainingPath));
    }

    current = current[key as any];
  }

  return current;
};

// Get path up to and including first wildcard (for UI display)
const getPathBeforeWildcard = (path: (string | number)[]): (string | number)[] => {
  const wildcardIndex = path.indexOf("*");
  if (wildcardIndex === -1) return path;
  return path.slice(0, wildcardIndex);
};

// Get path after wildcard (for UI display)
const getPathAfterWildcard = (path: (string | number)[]): (string | number)[] => {
  const wildcardIndex = path.indexOf("*");
  if (wildcardIndex === -1) return [];
  return path.slice(wildcardIndex + 1);
};

const getValueType = (value: any): "array" | "object" | "primitive" => {
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  return "primitive";
};

interface PathSelectorProps {
  rootData: any;
  currentPath: (string | number)[];
  onChange: (newPath: (string | number)[]) => void;
}

// const PathSelector: React.FC<PathSelectorProps> = ({ rootData, currentPath, onChange }) => {
//   const hasWildcard = currentPath.includes("*");
//   const wildcardIndex = currentPath.indexOf("*");

//   // Build selectors for each segment
//   const selectors: React.ReactNode[] = [];

//   let i = 0;
//   while (i <= currentPath.length) {
//     const pathUpToHere = currentPath.slice(0, i);
//     const isAtWildcard = currentPath[i] === "*";

//     // Resolve value at this point (stop at wildcard for preview)
//     let valueAtPath: any;
//     if (hasWildcard && i > wildcardIndex) {
//       // After wildcard: get first element's structure for preview
//       const beforeWildcard = currentPath.slice(0, wildcardIndex);
//       const arrayValue = resolvePath(rootData, beforeWildcard);
//       if (Array.isArray(arrayValue) && arrayValue.length > 0) {
//         const afterWildcardPath = currentPath.slice(wildcardIndex + 1, i);
//         valueAtPath = resolvePath(arrayValue[0], afterWildcardPath);
//       }
//     } else {
//       valueAtPath = resolvePath(rootData, pathUpToHere);
//     }

//     const type = getValueType(valueAtPath);

//     if (type === "primitive") break;

//     const currentKey = currentPath[i];

//     if (type === "array") {
//       selectors.push(
//         <select
//           key={`sel-${i}`}
//           value={currentKey === "*" ? "*" : (typeof currentKey === "number" ? currentKey : "__select__")}
//           onChange={(e) => {
//             const val = e.target.value;
//             let newPath: (string | number)[];

//             if (val === "__select__") {
//               newPath = currentPath.slice(0, i);
//             } else if (val === "*") {
//               newPath = [...currentPath.slice(0, i), "*"];
//             } else {
//               newPath = [...currentPath.slice(0, i), Number(val)];
//             }
//             onChange(newPath);
//           }}
//         >
//           <option value="__select__">— select —</option>
//           <option value="*">✱ each element (map)</option>
//           {valueAtPath.map((_: any, idx: number) => (
//             <option key={idx} value={idx}>[{idx}]</option>
//           ))}
//         </select>
//       );
//     } else if (type === "object") {
//       selectors.push(
//         <select
//           key={`sel-${i}`}
//           value={typeof currentKey === "string" && currentKey !== "*" ? currentKey : "__select__"}
//           onChange={(e) => {
//             const val = e.target.value;
//             if (val === "__select__") {
//               onChange(currentPath.slice(0, i));
//             } else {
//               onChange([...currentPath.slice(0, i), val]);
//             }
//           }}
//         >
//           <option value="__select__">— select key —</option>
//           {Object.keys(valueAtPath).map((k) => (
//             <option key={k} value={k}>{k}</option>
//           ))}
//         </select>
//       );
//     }

//     if (currentKey === undefined || currentKey === "__select__") break;
//     i++;
//   }

//   return <div className={classes.pathSelectors}>{selectors}</div>;
// };

const PathSelector: React.FC<PathSelectorProps> = ({
  rootData,
  currentPath,
  onChange,
}) => {
  const useRoot = currentPath.length === 0;

  // ---- ROOT VALUE SELECTOR (DEFAULT) ----
  // const rootSelector = (
  //   <select
  //     // value={useRoot ? "__root__" : "__custom__"}
  //     onChange={(e) => {
  //       if (e.target.value === "__root__") {
  //         onChange([]);
  //       }
  //     }}
  //   >
  //     <option value="__root__">✓ Use entire value (no mapping)</option>
  //     <option value="__custom__">Custom path…</option>
  //   </select>
  // );
  const rootSelector = (
    <select
      value={useRoot ? "__root__" : "__custom__"}
      onChange={(e) => {
        if (e.target.value === "__root__") {
          onChange([]);
        } else {
          onChange(["__select__"]); // enter custom mode
        }
      }}
    >
      <option value="__root__">✓ Use entire value (no mapping)</option>
      <option value="__custom__">Custom path…</option>
    </select>
  );

  // If user wants raw value → stop here
  if (useRoot) {
    return (
      <div className={classes.pathSelectors}>
        {rootSelector}
      </div>
    );
  }

  // ---- CUSTOM PATH SELECTORS ----
  const selectors: React.ReactNode[] = [];
  const hasWildcard = currentPath.includes("*");
  const wildcardIndex = currentPath.indexOf("*");

  let i = 0;

  while (i <= currentPath.length) {
    const pathUpToHere = currentPath.slice(0, i);

    // Resolve preview value
    let valueAtPath: any;

    if (hasWildcard && i > wildcardIndex) {
      const beforeWildcard = currentPath.slice(0, wildcardIndex);
      const arrayValue = resolvePath(rootData, beforeWildcard);

      if (Array.isArray(arrayValue) && arrayValue.length > 0) {
        const afterWildcard = currentPath.slice(wildcardIndex + 1, i);
        valueAtPath = resolvePath(arrayValue[0], afterWildcard);
      }
    } else {
      valueAtPath = resolvePath(rootData, pathUpToHere);
    }

    const type = getValueType(valueAtPath);
    if (type === "primitive") break;

    const currentKey = currentPath[i];

    // ---- ARRAY ----
    if (type === "array") {
      selectors.push(
        <select
          key={`sel-${i}`}
          value={
            currentKey === "*"
              ? "*"
              : typeof currentKey === "number"
                ? currentKey
                : "__select__"
          }
          onChange={(e) => {
            const val = e.target.value;
            let newPath: (string | number)[];

            if (val === "__select__") {
              newPath = currentPath.slice(0, i);
            } else if (val === "*") {
              newPath = [...currentPath.slice(0, i), "*"];
            } else {
              newPath = [...currentPath.slice(0, i), Number(val)];
            }

            onChange(newPath);
          }}
        >
          <option value="__select__">— select —</option>
          <option value="*">✱ each element (map)</option>
          {valueAtPath.map((_: any, idx: number) => (
            <option key={idx} value={idx}>
              [{idx}]
            </option>
          ))}
        </select>
      );
    }

    // ---- OBJECT ----
    if (type === "object") {
      selectors.push(
        <select
          key={`sel-${i}`}
          value={
            typeof currentKey === "string" && currentKey !== "*"
              ? currentKey
              : "__select__"
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__select__") {
              onChange(currentPath.slice(0, i));
            } else {
              onChange([...currentPath.slice(0, i), val]);
            }
          }}
        >
          <option value="__select__">— select key —</option>
          {Object.keys(valueAtPath).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      );
    }

    if (currentKey === undefined || currentKey === "__select__") break;
    i++;
  }

  return (
    <div className={classes.pathSelectors}>
      {rootSelector}
      {selectors}
    </div>
  );
};

// Preview the resolved value
const BindingPreview: React.FC<{ value: any }> = ({ value }) => {
  if (value === undefined) return <span className={classes.previewEmpty}>No data</span>;

  const preview = JSON.stringify(value, null, 2);
  const truncated = preview.length > 200 ? preview.slice(0, 200) + "..." : preview;

  return (
    <pre className={classes.preview}>
      {truncated}
    </pre>
  );
};

export const SidePanel = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: any) => state.ui.isSidePanelOpen);
  const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);
  const modules = useSelector((state: any) => state.modules.items || []);

  const selectedModule = modules.find((m: any) => m.id === selectedModuleId);
  const apiModules = modules.filter((m: any) => m.type === "api");

  /* ⬇️ ADD THESE LINES HERE ⬇️ */
  const isParser = selectedModule?.type === "parser";
  const parserModules = modules.filter(
    (m) => m.type === "parser"
  );

  const allDataModules = modules.filter(
    (m: any) => m.type === "api" || m.type === "parser"
  );

  const [tempX, setTempX] = React.useState(0);
  const [tempY, setTempY] = React.useState(0);
  const [tempW, setTempW] = React.useState(0);
  const [tempH, setTempH] = React.useState(0);

  React.useEffect(() => {
    if (!selectedModule) return;
    setTempX(selectedModule.x);
    setTempY(selectedModule.y);
    setTempW(selectedModule.width);
    setTempH(selectedModule.height);
  }, [selectedModuleId]);

  if (!selectedModule) {
    return (
      <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
        <div className={classes.header}>
          <h2>Module Settings</h2>
        </div>
        <div className={classes.placeholder}>Select a module to edit</div>
      </div>
    );
  }

  const propsObj = selectedModule.props || {};
  const bindings = selectedModule.bindings || {};

  const updateProp = (key: string, value: any) => {
    dispatch(updateModuleProps({ id: selectedModule.id, key, value }));
  };

  const updateBinding = (propName: string, apiId: string | null, path: (string | number)[] = []) => {
    dispatch(
      updateModuleBinding({
        id: selectedModule.id,
        prop: propName,
        apiId,
        path,
      })
    );
  };

  const renderPropField = (key: string, value: any) => {
    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => updateProp(key, Number(e.target.value))}
        />
      );
    }
    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => updateProp(key, e.target.checked)}
        />
      );
    }
    if (typeof value === "string") {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => updateProp(key, e.target.value)}
        />
      );
    }
    return (
      <textarea
        value={JSON.stringify(value, null, 2)}
        onChange={(e) => {
          try {
            updateProp(key, JSON.parse(e.target.value));
          } catch { }
        }}
      />
    );
  };

  return (
    <div className={`${classes.sidePanel} ${isOpen ? classes.open : ""}`}>
      <div className={classes.header}>
        <h2>Module Settings</h2>
        <button className={classes.closeButton} onClick={() => dispatch(closeSidePanel())}>
          ✕
        </button>
      </div>

      <div className={classes.content}>
        <div className={classes.generalContentWrapper}>
          {/* Position/Size controls - unchanged */}
          <div className={classes.group}>
            <label>Position X</label>
            <input
              type="number"
              value={tempX}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTempX(val);
                dispatch(updateModulePosition({ id: selectedModule.id, x: val, y: tempY }));
              }}
            />
          </div>

          <div className={classes.group}>
            <label>Position Y</label>
            <input
              type="number"
              value={tempY}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTempY(val);
                dispatch(updateModulePosition({ id: selectedModule.id, x: tempX, y: val }));
              }}
            />
          </div>

          <div className={classes.group}>
            <label>Width</label>
            <input
              type="number"
              value={tempW}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTempW(val);
                dispatch(updateModuleSize({ id: selectedModule.id, width: val, height: tempH }));
              }}
            />
          </div>

          <div className={classes.group}>
            <label>Height</label>
            <input
              type="number"
              value={tempH}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTempH(val);
                dispatch(updateModuleSize({ id: selectedModule.id, width: tempW, height: val }));
              }}
            />
          </div>

          <div className={classes.group}>
            <label>Component Type</label>
            <select
              value={selectedModule.type}
              onChange={(e) =>
                dispatch(updateModuleType({ id: selectedModule.id, type: e.target.value }))
              }
            >
              {Object.keys(componentMap).map((typeKey) => (
                <option key={typeKey} value={typeKey}>{typeKey}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={classes.generalContentWrapper}>
        {/* API Settings - unchanged */}
        {/* ========================================== API MODULE SETTINGS (flat props) ========================================== */}
        {selectedModule.type === "api" && (
          <>
            <h3 className={classes.sectionTitle}>API Settings</h3>

            <div className={classes.group}>
              <label>Name</label>
              <input
                type="text"
                //value={selectedModule.name ?? ""}
                defaultValue={selectedModule?.name ?? ""}
                onChange={(e) => updateProp("name", e.target.value)}
              />
            </div>

            <div className={classes.group}>
              <label>URL</label>
              <input
                type="text"
                //value={selectedModule.url ?? ""}
                onChange={(e) => updateProp("url", e.target.value)}
              />
            </div>

            <div className={classes.group}>
              <label>Method</label>
              <select
                //value={selectedModule.method ?? "GET"}
                onChange={(e) => updateProp("method", e.target.value)}
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>

            {(selectedModule.method ?? "GET") !== "GET" && (
              <div className={classes.group}>
                <label>Body (JSON)</label>
                <textarea
                  // value={
                  //   selectedModule.body
                  //     ? JSON.stringify(selectedModule.body, null, 2)
                  //     : ""
                  // }
                  onChange={(e) => {
                    try {
                      updateProp("body", JSON.parse(e.target.value));
                    } catch { }
                  }}
                />
              </div>
            )}

            <div className={classes.group}>
              <label>Headers (JSON)</label>
              <textarea
                // value={
                //   selectedModule.headers
                //     ? JSON.stringify(selectedModule.headers, null, 2)
                //     : "{}"
                // }
                onChange={(e) => {
                  try {
                    updateProp("headers", JSON.parse(e.target.value));
                  } catch { }
                }}
              />
            </div>

            <div className={classes.group}>
              <label>Body (JSON)</label>
              <textarea
                // value={
                //   selectedModule.body
                //     ? JSON.stringify(selectedModule.body, null, 2)
                //     : ""
                // }
                onChange={(e) => {
                  try {
                    updateProp("body", JSON.parse(e.target.value));
                  } catch { }
                }}
              />
            </div>

            <div className={classes.group}>
              <label>
                <input
                  type="checkbox"
                  checked={!!selectedModule.enabled}
                  onChange={(e) =>
                    updateProp("enabled", e.target.checked)
                  }
                />
                Enable Automatic Refresh
              </label>
            </div>

            <div className={classes.group}>
              <label>Refresh Interval (ms)</label>
              <input
                type="number"
                // value={selectedModule.refreshIntervalMs ?? 0}
                onChange={(e) =>
                  updateProp(
                    "refreshIntervalMs",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className={classes.group}>
              <label>Transform Path</label>
              <input
                type="text"
                // value={selectedModule.transformPath ?? ""}
                onChange={(e) =>
                  updateProp("transformPath", e.target.value)
                }
              />
            </div>

            <div className={classes.separator} />
          </>
        )}

        {/* PARSER Settings - unchanged */}
        {/* ========================================== PARSER MODULE SETTINGS (flat props) ========================================== */}
        {selectedModule.type === "parser" && (
          <>
            <h3 className={classes.sectionTitle}>Parser Settings</h3>

            {/* Input source */}
            <div className={classes.group}>
              <label>Input Module</label>
              <select
                value={selectedModule.props?.sourceModuleId || ""}
                onChange={(e) =>
                  updateProp("sourceModuleId", e.target.value || undefined)
                }
              >
                <option value="">— select source —</option>
                {allDataModules
                  .filter((m) => m.id !== selectedModule.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || m.id} ({m.type})
                    </option>
                  ))}
              </select>
            </div>

            {/* Schema type */}
            <div className={classes.group}>
              <label>Parser Type</label>
              <select
                value={selectedModule.props?.schema?.type || "passthrough"}
                onChange={(e) => {
                  const type = e.target.value;
                  let schema;

                  if (type === "array-map") {
                    schema = { type, fields: {}, castToNumber: true };
                  } else if (type === "object-map") {
                    schema = { type, fields: {} };
                  } else if (type === "object-map(each)") {
                    schema = { type, mode: "each", fields: {} };
                  } else {
                    schema = { type: "passthrough" };
                  }

                  updateProp("schema", schema);
                }}
              >
                <option value="passthrough">Pass Through</option>
                <option value="array-map">Array → Objects</option>
                <option value="object-map">Object → Object</option>
                <option value="object-map(each)">Object → Object (each)</option>
              </select>
            </div>

            {/* Schema editor */}
            {(() => {
              const schema = selectedModule.props?.schema;
              if (!schema || schema.type === "passthrough") return null;

              return (
                <div className={classes.group}>
                  <label>Schema Fields</label>

                  <textarea
                    // value={JSON.stringify(schema.fields || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        updateProp("schema", {
                          ...schema,
                          fields: JSON.parse(e.target.value),
                        });
                      } catch { }
                    }}
                    placeholder={
                      schema.type === "array-map"
                        ? `{ "open": 1, "high": 2, "low": 3, "close": 4 }`
                        : `{ "price": ["data", "price"] }`
                    }
                  />
                </div>
              );
            })()}

            {/* Output preview */}
            <div className={classes.group}>
              <label>Parsed Output Preview</label>
              <pre className={classes.preview}>
                {selectedModule.props?.lastData
                  ? JSON.stringify(selectedModule.props.lastData, null, 2)
                  : "No parsed data"}
              </pre>
            </div>

            <div className={classes.separator} />
          </>
        )}


        {/* Component Props with enhanced binding */}
        {selectedModule.type !== "api" && selectedModule.type !== "parser" && (
          <>
            <h3 className={classes.sectionTitle}>Component Props</h3>

            {Object.keys(propsObj).map((key) => {
              const binding = bindings[key];

              return (
                <div className={classes.group} key={key}>
                  <label>{key}</label>
                  {renderPropField(key, propsObj[key])}

                  <div className={classes.bindingRow}>
                    <select
                      value={binding?.apiId || ""}
                      onChange={(e) => updateBinding(key, e.target.value || null, [])}
                    >
                      <option value="">— bind to API —</option>
                      {parserModules.map((api) => (
                        <option key={api.id} value={api.id}>
                          {api.name || api.id}
                        </option>
                      ))}
                    </select>

                    {binding?.apiId && (() => {
                      const api = parserModules.find((m) => m.id === binding.apiId);
                      const rootData = api?.props?.lastData;

                      if (!rootData) return <span>No data from API</span>;

                      const resolvedValue = resolvePath(rootData, binding.path || []);

                      return (
                        <>
                          <PathSelector
                            rootData={rootData}
                            currentPath={binding.path || []}
                            onChange={(newPath) => updateBinding(key, binding.apiId, newPath)}
                          />
                          <BindingPreview value={resolvedValue} />
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
