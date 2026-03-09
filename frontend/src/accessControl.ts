import type { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, params }) => {
    if (resource === "dashboard") {
      return { can: true };
    }

    if (resource === "users") {
      // If permissions are not provided in params (common for menu items),
      // fetch them from the authProvider.
      let permissions = params?.permissions;
      
      if (!permissions) {
        permissions = await authProvider.getPermissions?.();
      }

      if (permissions?.includes("admin")) {
        return { can: true };
      }
      
      return {
        can: false,
        reason: "Unauthorized",
      };
    }

    return { can: true };
  },
};
