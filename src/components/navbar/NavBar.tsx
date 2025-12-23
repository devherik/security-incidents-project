"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import UserButton from "../user-btn/UserButton";
import { useAuthStore } from "../../stores/useAuthStore";

import logo from "../../assets/logos/p1-logo-small.png";
import homeIcon from "../../assets/icons/home.svg";
import homeSelectedIcon from "../../assets/icons/home-selected.svg";
import usersIcon from "../../assets/icons/users.svg";
import usersSelectedIcon from "../../assets/icons/users-selected.svg";
import tasksIcon from "../../assets/icons/tasks.svg";
import tasksSelectedIcon from "../../assets/icons/tasks-selected.svg";
import insightsIcon from "../../assets/icons/insights.svg";
import insightsSelectedIcon from "../../assets/icons/insights-selected.svg";
import logoutIcon from "../../assets/icons/logout.svg";
import styles from "./style.module.css";
import { useAppStore } from "../../stores/useAppStateStore";
import Loader from "../loader/Loader";
import usePermissions from "../../hooks/usePermissions";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();
  const { showToast, visibleNavbar } = useAppStore();
  const { hasGroup } = usePermissions();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      showToast("Tenha um ótimo dia!", "success");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("Erro ao sair. Tente novamente.", "error");
    } finally {
      setLoggingOut(false);
    }
  }, [logout, navigate, showToast]);

  const isActive = (path: string) => location.pathname === path;

  // Don't show navbar on login and home pages
  if (location.pathname === "/login" || location.pathname === "/home") {
    return null;
  }

  // Don't show navbar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (loggingOut) {
    return <Loader size={100} message="Saindo..." />;
  }

  return (
    <nav
      className={`${styles.navbar} ${
        !visibleNavbar ? styles.navbarHidden : ""
      }`}
    >
      <div className={styles.navTop}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        {/* User Button */}
        <div className={styles.userButton}>
          <UserButton />
        </div>

        {/* Navigation Items */}
        <div className={styles.navItems}>
          <button
            onClick={() => navigate("/dashboard")}
            className={`${styles.navItem} ${
              isActive("/dashboard") ? styles.active : ""
            }`}
            title="Home"
          >
            <img
              src={isActive("/dashboard") ? homeSelectedIcon : homeIcon}
              alt="Home"
              className={styles.navIcon}
            />
          </button>

          {(hasGroup(3) || hasGroup(4)) && (
            <button
              onClick={() => navigate("/tarefas-master")}
              className={`${styles.navItem} ${
                isActive("/tarefas-master") ? styles.active : ""
              }`}
              title="Tarefas"
            >
              <img
                src={
                  isActive("/tarefas-master") ? tasksSelectedIcon : tasksIcon
                }
                alt="Tarefas"
                className={styles.navIcon}
              />
            </button>
          )}

          {hasGroup(2) && (
            <button
              onClick={() => navigate("/equipe")}
              className={`${styles.navItem} ${
                isActive("/equipe") ? styles.active : ""
              }`}
              title="Equipe"
            >
              <img
                src={isActive("/equipe") ? usersSelectedIcon : usersIcon}
                alt="Equipe"
                className={styles.navIcon}
              />
            </button>
          )}

          {hasGroup(4) && (
            <button
              onClick={() => navigate("/analytics")}
              className={`${styles.navItem} ${
                isActive("/analytics") ? styles.active : ""
              }`}
              title="Analytics"
            >
              <img
                src={
                  isActive("/analytics") ? insightsSelectedIcon : insightsIcon
                }
                alt="Analytics"
                className={styles.navIcon}
              />
            </button>
          )}
        </div>
      </div>

      {/* Logout Button at Bottom */}
      <div className={styles.navBottom}>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
          title="Sair"
        >
          <img src={logoutIcon} alt="Sair" className={styles.navIcon} />
        </button>
        <span className={styles.version}>v0.0.2</span>
      </div>
    </nav>
  );
}
