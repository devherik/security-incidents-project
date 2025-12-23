import { Navigate, useLocation } from "react-router-dom";
import Loader from "../loader/Loader";
import { useAuthStore } from "../../stores/useAuthStore";
import usePermissions from "../../hooks/usePermissions";
import { useAppStore } from "../../stores/useAppStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedGroups?: number[];
}

export default function ProtectedRoute({
  children,
  allowedGroups,
}: ProtectedRouteProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const showToast = useAppStore((state) => state.showToast);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { hasGroup } = usePermissions();
  const location = useLocation();

  // 1. Hydration Check: Don't do anything until we know the auth state
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={100} message="Verificando autenticação..." />
      </div>
    );
  }

  // 2. Authentication Check: If not logged in, bounce to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authorization Check: If specific groups are required
  if (allowedGroups && allowedGroups.length > 0) {
    // We check if the user has ANY of the allowed groups
    const hasAccess = allowedGroups.some((groupId) => hasGroup(groupId));

    if (!hasAccess) {
      showToast(
        "Acesso negado: você não tem permissão para ver esta página.",
        "error"
      );
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 4. Happy Path: User is authenticated and authorized (or no groups required)
  return <>{children}</>;
}
