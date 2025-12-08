import { Outlet } from "react-router";
import classes from "./index.module.scss";
import SidePanel from "../components/SidePanel";

export const DefaultLayout = () => {

  return (
    <div className={classes.defaultLayoutContainer}>
      <SidePanel />
      <main>
        <div className={classes.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
