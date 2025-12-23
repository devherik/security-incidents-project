import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useWelcomeStore } from "../../stores/useWelcomeStore";

const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We subscribe to the store state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const { hasSeenWelcome } = useWelcomeStore();

  // Reactive Redirect - only runs AFTER hydration is complete
  // This effect runs whenever 'isAuthenticated' or 'isHydrated' changes.
  // If the API Client triggers logout(), this effect will fire immediately.
  useEffect(() => {
    // Don't redirect until we know the actual auth state
    if (!isHydrated) return;

    const currentPath = location.pathname;

    // If user is authenticated and on login, go to dashboard
    if (isAuthenticated && currentPath === "/login") {
      navigate("/dashboard", { replace: true });
      return;
    }

    // If user is NOT authenticated (e.g. after 401 logout), go to login
    if (!isAuthenticated) {
      // Allow public access to home/welcome if needed, otherwise lock it down
      if (!hasSeenWelcome && currentPath === "/home") {
        return;
      }

      if (currentPath !== "/login" && currentPath !== "/home") {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isHydrated, location.pathname, navigate, hasSeenWelcome]);

  return null;
};

export default AuthHandler;
