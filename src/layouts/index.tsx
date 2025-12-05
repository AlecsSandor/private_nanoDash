import { Outlet } from "react-router";
import classes from "./index.module.scss";

export const DefaultLayout = () => {

  return (
    <div className={classes.defaultLayoutContainer}>
      <main>
        <div className={classes.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
