import { Outlet } from "react-router";
import classes from "./index.module.scss";
import SidePanel from "../components/SidePanel";

export const DefaultLayout = () => {

  return (
    <div className={classes.defaultLayoutContainer}>
      <SidePanel />
      <main className={classes.mainContent}>
        <div className={classes.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
