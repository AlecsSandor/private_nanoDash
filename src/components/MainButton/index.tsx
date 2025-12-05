import clsx from "clsx";
import { SvgIcon, IconNames } from "../SvgIcon";
import classes from "./styles.module.scss";

export interface MainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: IconNames;
  variant?: "primary" | "secondary" | "tertiary";
  color?: "orange";
  fullWidth?: boolean;
  disabled?: boolean;
}

export const MainButton: React.FC<MainButtonProps> = ({
  title,
  icon,
  variant = "primary",
  className,
  children,
  fullWidth,
  color = "",
  disabled = false,
  ...rest
}) => {

  return (
    <button
      className={clsx(classes.Button, className, classes[variant], {
        [classes[color]]: color,
        [classes.fullWidth]: fullWidth,
        [classes.disabled]: disabled,
      })}
      disabled={disabled}
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

export default MainButton;
