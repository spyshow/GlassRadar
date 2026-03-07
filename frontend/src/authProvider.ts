import { AuthProvider } from "@refinedev/core";
import { account } from "./utility/appwrite";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            await account.createEmailSession(email, password);
            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error.message,
                    name: "Login Error",
                },
            };
        }
    },
    logout: async () => {
        try {
            await account.deleteSession("current");
        } catch (error: any) {}
        return {
            success: true,
            redirectTo: "/login",
        };
    },
    check: async () => {
        try {
            await account.get();
            return {
                authenticated: true,
            };
        } catch (error: any) {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
        const user = await account.get();
        if (user) {
            return user;
        }
        return null;
    },
    onError: async (error) => {
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }
        return {};
    },
};