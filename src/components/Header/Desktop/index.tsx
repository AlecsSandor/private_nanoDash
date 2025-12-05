import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../../../store/hooks";
import { useAppSelector } from "../../../store/hooks";
// import { logout } from "../../../store/features/auth/authSlice";
import { logoutThunk } from "../../../store/features/auth/authSlice";
import { showNotification } from "../../../store/features/notifications/notificationSlice";
import ThemeToggle from "../../../components/ThemeToggle";
import { setTheme } from "../../../store/uiSlice";
import { RootState } from "../../../store/store";
import classes from "./styles.module.scss";
import clsx from "clsx";

export const Desktop = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(auth.accessToken);
  const authLoading = auth.loading;
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDarkTheme = theme === "dark";
  const dispatch = useAppDispatch();

  const [isShrunk, setIsShrunk] = useState(false);

  // 👇 detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsShrunk(scrollY > 50); // shrink when user scrolls more than 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/");
    dispatch(showNotification({ message: "Signed out successfully.", type: "success" }));
  };

  const handleToggle = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    dispatch(setTheme(newTheme));
    localStorage.setItem("ui.theme", newTheme); // optional persistence
    document.documentElement.setAttribute("data-theme", newTheme); // optional for CSS theme switching
  };

  const guestLinks = [
    { id: 1, title: "Register", path: "/register", onClick: () => {} },
    { id: 2, title: "Sign In", path: "/signIn", onClick: () => {} },
  ];

  const userLinks = [
    { id: 3, title: "Dashboard", path: "/dashboard", onClick: () => {} },
    { id: 4, title: "Logout", path: "#", onClick: handleLogout },
  ];

  const linksToRender = isLoggedIn ? userLinks : guestLinks;

  return (
    <header className={classes.desktopContainer}>
      <div className={clsx(classes.content, { [classes.shrunk]: isShrunk })}>
        <div className={classes.logo} onClick={() => navigate("/")}>
          .shortform
        </div>
        <div className={classes.rightSide}>
          {!authLoading &&
            linksToRender.map((link) => (
              <NavLink key={link.id} to={link.path} onClick={link.onClick} className={classes.link}>
                <span className={classes.title}>{link.title}</span>
              </NavLink>
            ))}
            <ThemeToggle checked={isDarkTheme} onChange={handleToggle}/>
        </div>
      </div>
    </header>
  );
};

export default Desktop;
