import { AppwriteException, Query } from "@refinedev/appwrite";
import type { AuthProvider } from "@refinedev/core";
import { v4 as uuidv4 } from "uuid";
import { account, databases } from "./utility";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      await account.createEmailPasswordSession(email, password);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      const { type, message, code } = error as AppwriteException;
      return {
        success: false,
        error: {
          message,
          name: `${code} - ${type}`,
        },
      };
    }
  },
  logout: async () => {
    try {
      await account.deleteSession("current");
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password, name }) => {
    try {
      const userId = uuidv4();
      await account.create(userId, email, password, name);
      
      // Also create a entry in our users collection with default role
      await databases.createDocument(
        "default",
        "users",
        uuidv4(),
        {
            userId: userId,
            email: email,
            name: name,
            role: "IS operator", // Default role
        }
      );

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      const { type, message, code } = error as AppwriteException;
      return {
        success: false,
        error: {
          message,
          name: `${code} - ${type}`,
        },
      };
    }
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    try {
      const session = await account.get();

      if (session) {
        return {
          authenticated: true,
        };
      }
    } catch (error: any) {
      return {
        authenticated: false,
        error: error,
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Session not found",
      },
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    try {
        const user = await account.get();
        const { documents } = await databases.listDocuments(
            "default",
            "users",
            [Query.equal("userId", user.$id)]
        );

        if (documents.length > 0) {
            return [documents[0].role];
        }
    } catch (e) {
        console.error("Error fetching permissions:", e);
    }
    return null;
  },
  getIdentity: async () => {
    try {
        const user = await account.get();
        const { documents } = await databases.listDocuments(
            "default",
            "users",
            [Query.equal("userId", user.$id)]
        );

        if (documents.length > 0) {
            const profile = documents[0];
            return {
                id: user.$id,
                name: user.name,
                avatar: profile.avatar,
                position: profile.position,
            };
        }

        return {
            id: user.$id,
            name: user.name,
        };
    } catch (e) {
        console.error("Error fetching identity:", e);
        return null;
    }
  },
};
