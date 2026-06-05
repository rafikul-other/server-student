import { ROLES, ROLE_PERMISSIONS } from "../config/roles.js";
import { errorResponse } from "../utils/responseHelper.js";

export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user || {};
    if (!role) {
      return errorResponse(res, "Access denied. No role found.", 403);
    }
    if (!allowedRoles.includes(role)) {
      return errorResponse(res, `Access denied. Required role: ${allowedRoles.join(" or ")}`, 403);
    }
    next();
  };
};

export const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const { role } = req.user || {};
    if (!role) {
      return errorResponse(res, "Access denied. No role found.", 403);
    }
    const permissions = ROLE_PERMISSIONS[role] || [];
    const hasAllPermissions = requiredPermissions.every((p) => permissions.includes(p));
    if (!hasAllPermissions) {
      return errorResponse(res, "Access denied. Insufficient permissions.", 403);
    }
    next();
  };
};

export const isSuperAdmin = hasRole(ROLES.SUPERADMIN);
export const isAdmin = hasRole(ROLES.SUPERADMIN, ROLES.ADMIN);
export const isDepartmentManager = hasRole(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER);
export const isStudent = hasRole(ROLES.STUDENT);
export const canViewReports = hasRole(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER);

export const canAccessStudentRecord = (paramName = "id") => {
  return (req, res, next) => {
    const { id, role } = req.user || {};
    const studentId = req.params[paramName];

    if (!role) {
      return errorResponse(res, "Access denied. No role found.", 403);
    }

    if ([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.DEPARTMENT_MANAGER].includes(role)) {
      return next();
    }

    if (role === ROLES.STUDENT && id === studentId) {
      return next();
    }

    return errorResponse(res, "Access denied. You can only access your own student record.", 403);
  };
};
