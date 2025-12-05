import classes from "./styles.module.scss";
import { Module } from "../../components/Module";

export const LandingPage = () => {

  return (
    <div className={classes.LandingPage}>
      <div className={classes.AppHeader}>

        <Module />
        <Module />
        <Module />

      </div>
    </div>
  )
}

export default LandingPage;