import { useNavigate, NavLink } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../../../store/hooks";
import { useAppDispatch } from "../../../store/hooks";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { BurgerButton } from "./BurgerButton";
import { logout } from "../../../store/features/auth/authSlice";
import { logoutThunk } from "../../../store/features/auth/authSlice";
import { showNotification } from "../../../store/features/notifications/notificationSlice";
import { toggleMobileNav } from "../../../store/features/ui/uiSlice";
import ThemeToggle from "../../../components/ThemeToggle";
import { setTheme } from "../../../store/uiSlice";
import { RootState } from "../../../store/store";

export const Mobile = () => {
  // const dispatch = useDispatch();
  const isMobileNavOpen = useAppSelector((state) => state.ui.isMobileNavOpen);
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const isLoggedIn = Boolean(auth.accessToken);
  const authLoading = auth.loading;
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDarkTheme = theme === "dark";
  const dispatch = useAppDispatch();

  const handleToggleNav = () => {
    dispatch(toggleMobileNav());
  };

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
    { id: 1, title: "Home", path: "/", onClick: () => { dispatch(toggleMobileNav());} },
    { id: 2, title: "Register", path: "/register", onClick: () => { dispatch(toggleMobileNav()); } },
    { id: 3, title: "Sign In", path: "/signIn", onClick: () => { dispatch(toggleMobileNav()); } },
  ];

  const userLinks = [
    { id: 1, title: "Home", path: "/", onClick: () => { dispatch(toggleMobileNav());} },
    { id: 2, title: "Dashboard", path: "/dashboard", onClick: () => { dispatch(toggleMobileNav()); } },
    { id: 3, title: "Account Settings", path: "/dashboard/settings", onClick: () => { dispatch(toggleMobileNav());} },
  ];

  const bottomLinks = [
    { id: 1, title: "Log out", path: "#", onClick: handleLogout },
  ]

  const linksToRender = isLoggedIn ? userLinks : guestLinks;

  return (
    <header className={classes.mobileContainer}>
      <div className={classes.filler} />
      <div className={clsx(classes.content, { [classes.shrunk]: isShrunk })}>
        <div className={classes.logo} onClick={() => navigate("/")}>
          {/* <img src="/logo_l.svg" alt="Logo" /> */}
          .shortform
        </div>

        <div className={classes.right}>
          <ThemeToggle checked={isDarkTheme} onChange={handleToggle} isMobile={true}/>
          <BurgerButton open={isMobileNavOpen} onClick={handleToggleNav} />
        </div>
      </div>
      <nav className={clsx({ [classes.expanded]: isMobileNavOpen })}>
        {/* <nav className={classes.expanded}> */}
        <div className={classes.top}>
          {!authLoading && linksToRender.map(link => (
            <NavLink key={link.id} to={link.path} onClick={link.onClick} className={classes.link}>
              <span className={classes.title}>{link.title}</span>
            </NavLink>
          ))}
        </div>
        <div className={classes.bottom}>
          {isLoggedIn && bottomLinks.map(link => (
            <NavLink key={link.id} to={link.path} onClick={link.onClick} className={classes.link}>
              <span className={classes.title}>{link.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Mobile;
