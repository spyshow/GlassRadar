import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client();

client
    .setEndpoint("http://appwrite.local/v1") // Internal Docker Alias
    .setProject("glassradar");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client };
