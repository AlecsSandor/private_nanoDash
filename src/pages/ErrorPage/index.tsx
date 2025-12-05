import classes from "./styles.module.scss";
import { SimpleButton } from '../../components/SimpleButton';

export const ErrorPage = () => {
  return (
    <div className={classes.ErrorPage}>
      <div className={classes.mainSection}>
        <div className={classes.header}>shortform</div>
        <div className={classes.textCenter}>
          <h2 className={classes.errorText}>404</h2>
          <p className={classes.commentText}>Ohiii Hvee Shalom, are you in the right place?</p>
          <SimpleButton onClick={() => window.location.href = "/"} variant='primary'>Back to Home</SimpleButton>
        </div>
        <div className={classes.footer}>
          <p className={classes.footerText}>
            veswip.shortform © 2025
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage