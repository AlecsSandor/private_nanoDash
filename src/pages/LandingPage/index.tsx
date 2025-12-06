import classes from "./styles.module.scss";
import { Module } from "../../components/Module";

export const LandingPage = () => {
  const modules = [
    { id: '1', initialPosition: { x: 0, y: 0 }, width: 224, height: 168 },
    { id: '2', initialPosition: { x: 250, y: 0 }, width: 168, height: 224 },
    { id: '3', initialPosition: { x: 0, y: 200 }, width: 280, height: 112 },
    { id: '4', initialPosition: { x: 350, y: 200 }, width: 168, height: 112 },
    { id: '5', initialPosition: { x: 0, y: 350 }, width: 224, height: 168 },
    { id: '6', initialPosition: { x: 250, y: 350 }, width: 168, height: 112 },
  ];

  return (
    <div className={classes.LandingPage}>
      <div className={classes.AppHeader}>
        {modules.map((module) => (
          <Module
            key={module.id}
            id={module.id}
            initialPosition={module.initialPosition}
            width={module.width}
            height={module.height}
          />
        ))}
      </div>
    </div>
  )
}

export default LandingPage;