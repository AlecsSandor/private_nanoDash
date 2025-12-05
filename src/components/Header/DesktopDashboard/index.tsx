import { useNavigate, NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/features/auth/authSlice";
import classes from "./styles.module.scss";
import { showNotification } from "../../../store/features/notifications/notificationSlice";


export const DesktopDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // clears token and user from Redux
    navigate("/");       // redirect to homepage
    dispatch(showNotification({ message: "Signed out sccesfully.", type: "success" }));
  };

  const upperLinks = [
    { id: 1, title: "Saved Posts", path: "/dashboard" },
    { id: 2, title: "Account Settings", path: "/dashboard/settings" },
    { id: 3, title: "Home", path: "/" },
  ]

  const bottomLinks = [
    { id: 1, title: "Log out", path: "#", onClick: handleLogout },
  ]

  return (
    <header className={classes.DesktopDashboard}>
      {/* <div className={classes.filler} /> */}
      <div className={classes.content}>
        {/* <div className={classes.logo} onClick={() => navigate("/")}>
          <img src="/logo_l.svg" alt="Logo" />
          .shortform
        </div> */}
        <div className={classes.menuWrapper}>
          <div className={classes.dashMenu}>
            {upperLinks.map(link => (
              <NavLink key={link.id} to={link.path} className={classes.link}>
                <span className={classes.title}>{link.title}</span>
              </NavLink>
            ))}
          </div>
          <div className={classes.userMenu}>
            {bottomLinks.map(link => (
              <NavLink key={link.id} to={link.path} onClick={link.onClick} className={classes.link}>
                <span className={classes.title}>{link.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

    </header>
  );
};

export default DesktopDashboard;
