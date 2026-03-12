import { Client, Databases, Role, Permission, Users, ID, Teams } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = new Client()
    .setEndpoint('http://localhost/v1')
    .setProject(process.env.APPWRITE_PROJECT || 'glassradar')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const authUsers = new Users(client);
const teams = new Teams(client);

async function setup() {
    const dbId = 'default';
    const msgCollId = 'messages';

    try {
        console.log('Ensuring "messages" collection exists with standard string channel attribute...');
        
        try {
            console.log('Deleting existing "channel" enum attribute...');
            await databases.deleteAttribute(dbId, msgCollId, 'channel');
            // Wait for deletion to propagate
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (e) {
            console.log('Channel attribute might not exist or already deleted.');
        }

        console.log('Creating "channel" as a standard string attribute...');
        await databases.createStringAttribute(dbId, msgCollId, 'channel', 255, true);
        
        console.log('Waiting for attribute to index...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('Setup complete!');
    } catch (error) {
        console.error('Error during setup:', error.message);
        process.exit(1);
    }
}

setup();
