import React from "react";
import classes from "./styles.module.scss";

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Card title */
  title?: string;
  /** Description text */
  description?: string;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Icon size in pixels (overrides size preset) */
  iconSize?: number;
  /** Text alignment */
  alignment?: "left" | "center" | "right";
  /** Card variant */
  variant?: "default" | "gradient" | "glass";
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title = "Title",
  description = "Description text goes here.",
  size = "md",
  iconSize,
  alignment = "left",
  variant = "default",
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: classes.sizeSm,
    md: classes.sizeMd,
    lg: classes.sizeLg,
  };

  const alignmentClasses = {
    left: classes.alignLeft,
    center: classes.alignCenter,
    right: classes.alignRight,
  };

  const variantClasses = {
    default: classes.variantDefault,
    gradient: classes.variantGradient,
    glass: classes.variantGlass,
  };

  const defaultIconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const computedIconSize = iconSize || defaultIconSizes[size];

  return (
    <div
      className={`${classes.container} ${sizeClasses[size]} ${alignmentClasses[alignment]} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {icon && (
        <div 
          className={classes.iconWrapper}
          style={{ 
            width: computedIconSize, 
            height: computedIconSize,
            fontSize: computedIconSize 
          }}
        >
          {icon}
        </div>
      )}
      <div className={classes.content}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.description}>{description}</p>
      </div>
    </div>
  );
};

export default InfoCard;