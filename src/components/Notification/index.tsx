import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { hideNotification } from "../../store/features/notifications/notificationSlice";
import classes from "./styles.module.scss";

const Notification = () => {
  const { message, type, visible } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  if (!visible) return null;

  return (
    <div className={`${classes.Notification} ${type ? classes[type] : ""}`}>
      <span>{message}</span>
      <button className={classes.closeButton}
        onClick={() => dispatch(hideNotification())}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;