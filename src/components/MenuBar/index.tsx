// import React from "react";
// import classes from "./styles.module.scss";
// import { useDispatch, useSelector } from "react-redux";
// import { addModule, duplicateModule } from "../../store/features/modules/modulesSlice";
// import SvgIcon from "../SvgIcon";

// export const MenuBar: React.FC = () => {
//   const dispatch = useDispatch();
//   const selectedModuleId = useSelector((state: any) => state.ui.selectedModuleId);

//   const handleAddModule = () => {
//     const width = 1;
//     const height = 1;

//     const x = window.innerWidth / 2 - width / 2;
//     const y = window.innerHeight / 2 - height / 2;

//     dispatch(
//       addModule({
//         id: crypto.randomUUID(),
//         x: x,
//         y: y,
//         width: width,
//         height: height,
//         title: "", 
//         subtitle: "", 
//         type: "none"
//       })
//     );
//   };

//   const handleDuplicate = () => {
//     if (!selectedModuleId) return;

//     const x = window.innerWidth / 2 - 80 / 2;
//     const y = window.innerHeight / 2 - 80 / 2;
//     console.log("Hello")
//     dispatch(
//       duplicateModule({
//         id: selectedModuleId,
//         x,
//         y,
//       })
//     );
//   };

//   return (
//     <div className={classes.MenuBar}>
//       <div className={classes.Inner}>

//         {/* ADD BUTTON */}
//         <button className={classes.RoundButton} onClick={handleAddModule}>
//           <span className={classes.Plus}>+</span>
//         </button>

//         {/* DUPLICATE BUTTON */}
//         <button className={classes.RoundButton} onClick={handleDuplicate}>
//           <div className={classes.icon}>
//               <SvgIcon name="copy" />
//             </div>
//         </button>

//         {/* Existing Buttons */}
//         {/* <button className={classes.MenuButton} onClick={handleAddModule}>Add Module</button>

//         <button className={classes.MenuButton} onClick={handleDuplicate}>
//           Duplicate
//         </button>

//         <button className={classes.MenuButton}>Delete</button> */}
//       </div>
//     </div>
//   );
// };

// export default MenuBar;


import React from "react";
import classes from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addModule,
  duplicateModule,
} from "../../store/features/modules/modulesSlice";
import SvgIcon from "../SvgIcon";

/* ────────────────────────────────────────────── */
/* Types */
/* ────────────────────────────────────────────── */

interface MenuBarProps {
  mobileLayout?: "carousel" | "stack";
  onToggleMobileLayout?: () => void;
}

/* ────────────────────────────────────────────── */

export const MenuBar: React.FC<MenuBarProps> = ({
  mobileLayout,
  onToggleMobileLayout,
}) => {
  const dispatch = useDispatch();
  const selectedModuleId = useSelector(
    (state: any) => state.ui.selectedModuleId
  );

  const handleAddModule = () => {
    const width = 1;
    const height = 1;

    const x = window.innerWidth / 2 - width / 2;
    const y = window.innerHeight / 2 - height / 2;

    dispatch(
      addModule({
        id: crypto.randomUUID(),
        x,
        y,
        width,
        height,
        title: "",
        subtitle: "",
        type: "none",
      })
    );
  };

  const handleDuplicate = () => {
    if (!selectedModuleId) return;

    const x = window.innerWidth / 2 - 80 / 2;
    const y = window.innerHeight / 2 - 80 / 2;

    dispatch(
      duplicateModule({
        id: selectedModuleId,
        x,
        y,
      })
    );
  };

  return (
    <div className={classes.MenuBar}>
      <div className={classes.Inner}>
        {/* ───────── ADD ───────── */}
        <button className={classes.RoundButton} onClick={handleAddModule}>
          <span className={classes.Plus}>+</span>
        </button>

        {/* ───────── DUPLICATE ───────── */}
        <button
          className={classes.RoundButton}
          onClick={handleDuplicate}
          disabled={!selectedModuleId}
        >
          <div className={classes.icon}>
            <SvgIcon name="copy" />
          </div>
        </button>

        {/* ───────── MOBILE LAYOUT TOGGLE ───────── */}
        {mobileLayout && onToggleMobileLayout && (
          <button
            className={classes.RoundButton}
            onClick={onToggleMobileLayout}
            title={
              mobileLayout === "carousel"
                ? "Switch to stack view"
                : "Switch to carousel view"
            }
          >
            <div className={classes.icon}>
              <SvgIcon
                name={mobileLayout === "carousel" ? "stack" : "carousel"}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
