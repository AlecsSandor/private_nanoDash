import { Link } from "react-router-dom";
import classes from "./styles.module.scss";

export const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerLinks}>
        <Link to="/contact">Contact</Link>
        <Link to="/terms-and-conditions">Terms and conditions</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
      <div className={classes.copyright}>
        shortform.veswip © 2025. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
