import { useAuthStore } from "../stores/useAuthStore";

export default function usePermissions() {
  const colaborador = useAuthStore((state) => state.colaborador);

  const hasGroup = (groupId: number): boolean => {
    if (!colaborador || !colaborador.groups) return false;

    if (colaborador.groups.includes(4)) {
      return true; // Admins have all permissions
    }

    // Check for specific group
    return colaborador?.groups?.includes(groupId) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!colaborador || !colaborador.user_permissions) return false;

    if (colaborador.user_permissions.includes("all_permissions")) {
      return true; // Users with all_permissions have all permissions
    }

    // Check for specific permission
    return colaborador.user_permissions.includes(permission);
  };

  return {
    hasGroup,
    hasPermission,
    colaborador,
  };
}
