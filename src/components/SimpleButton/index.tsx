import clsx from "clsx";
import { SvgIcon, IconNames } from "../SvgIcon";
import classes from "./styles.module.scss";

export interface SimpleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: IconNames;
  variant?: "primary" | "secondary" | "tertiary";
  color?: "orange";
  fullWidth?: boolean;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  icon,
  variant = "primary",
  className,
  children,
  fullWidth,
  color = "",
  ...rest
}) => {

  return (
    <button
      className={clsx(classes.SimpleButton, className, classes[variant], {
        [classes[color]]: color,
        [classes.fullWidth]: fullWidth,
      })}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <>
          {title}
          {icon && <SvgIcon name={icon} className={classes.icon} />}
        </>
      )}
    </button>
  );
};

export default SimpleButton;
