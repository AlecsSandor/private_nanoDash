import clsx from "clsx";
import classes from "./styles.module.scss";

export interface BurgerButtonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClick?: () => void;
}

export const BurgerButton: React.FC<BurgerButtonProps> = ({
  open = false,
  onClick = () => {},
  ...rest
}) => {
  return (
    <div
      className={clsx(classes.BurgerButton, { [classes.open]: open })}
      onClick={onClick}
      {...rest}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
