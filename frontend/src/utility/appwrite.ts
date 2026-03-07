import { Client, Account } from "appwrite";

const client = new Client();

client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || "http://localhost/v1")
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID || "glassradar");

export const account = new Account(client);
export { client };