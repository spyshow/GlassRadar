import { Account, Appwrite, Storage, Databases } from "@refinedev/appwrite";

const APPWRITE_URL = "http://localhost/v1";
const APPWRITE_PROJECT = "glassradar";

const appwriteClient = new Appwrite();

appwriteClient.setEndpoint(APPWRITE_URL).setProject(APPWRITE_PROJECT);
const account = new Account(appwriteClient);
const storage = new Storage(appwriteClient);
const databases = new Databases(appwriteClient);

export { account, appwriteClient, storage, databases };
