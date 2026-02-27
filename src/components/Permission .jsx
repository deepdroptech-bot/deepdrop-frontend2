// components/PermissionGate.jsx

import { useAuth } from "../context/AuthContext";
import { PERMISSIONS } from "../config/permissions";

export default function Permissions({ permission, children, fallback = null }) {
  const { user } = useAuth();

  if (!user) return null;

  const allowedRoles = PERMISSIONS[permission];

  if (!allowedRoles?.includes(user.role)) {
    return fallback;
  }

  return children;
}