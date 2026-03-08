import type { AccessControlProvider } from "@refinedev/core";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, params }) => {
    if (resource === "dashboard") {
      return { can: true };
    }

    if (resource === "users") {
      const permissions = params?.permissions;
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
