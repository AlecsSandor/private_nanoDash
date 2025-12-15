import styles from "./styles.module.scss";

export interface PlainImageProps extends React.HTMLAttributes<HTMLDivElement> {
  imgSource?: string;
}

const PlainImage: React.FC<PlainImageProps> = ({
  imgSource = "",
  ...props
}) => {

  return (
    <div className={styles.container} role="img" aria-label="bar chart" {...props}>
      <div className={styles.imgwrapper}>
        <img src={imgSource} alt="Plain content" className={styles.image} />
      </div>
    </div>
  );
};

export default PlainImage;
