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

    try {
        console.log('Creating database "default" if it doesn\'t exist...');
        try {
            await databases.create(dbId, 'Default Database');
        } catch (e) {
            console.log('Database might already exist.');
        }

        console.log('Ensuring "admin" team exists...');
        let adminTeamId = 'admin';
        try {
            await teams.create(adminTeamId, 'Administrators');
            console.log('Admin team created.');
        } catch (e) {
            console.log('Admin team might already exist.');
        }

        // --- USERS COLLECTION ---
        console.log('Updating "users" collection permissions...');
        const userPermissions = [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ];

        try {
            await databases.updateCollection(dbId, 'users', 'Users', userPermissions);
            console.log('Users permissions updated.');
            
            try {
                await databases.createStringAttribute(dbId, 'users', 'password', 255, false);
                console.log('Password attribute created.');
            } catch (e) {}
        } catch (e) {
            console.log('Users collection logic complete.');
        }

        // --- MESSAGES COLLECTION ---
        console.log('Ensuring "messages" collection exists...');
        const msgCollId = 'messages';
        const msgPermissions = [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.team('admin')),
            Permission.delete(Role.team('admin')),
        ];

        try {
            await databases.createCollection(dbId, msgCollId, 'Messages', msgPermissions);
            console.log('Messages collection created. Creating attributes...');
            await databases.createStringAttribute(dbId, msgCollId, 'content', 5000, true);
            await databases.createStringAttribute(dbId, msgCollId, 'senderId', 255, true);
            await databases.createStringAttribute(dbId, msgCollId, 'senderName', 255, true);
            await databases.createStringAttribute(dbId, msgCollId, 'senderRole', 255, true);
            await databases.createEnumAttribute(dbId, msgCollId, 'channel', ['general', 'IS', 'QC', 'QA', 'mold'], true);
            await databases.createDatetimeAttribute(dbId, msgCollId, 'timestamp', true);
            
            console.log('Waiting for attributes to index...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (e) {
            if (e.message.includes('already exists')) {
                console.log('Messages collection exists, updating permissions...');
                await databases.updateCollection(dbId, msgCollId, 'Messages', msgPermissions);
            } else {
                console.error('Error with messages collection:', e.message);
            }
        }

        console.log('Ensuring Admin User exists...');
        const adminEmail = 'admin@glassradar.local';
        const adminPassword = 'admin123';
        const adminName = 'System Admin';
        let userId;

        try {
            const list = await authUsers.list();
            const existing = list.users.find(u => u.email === adminEmail);
            if (existing) {
                userId = existing.$id;
            } else {
                const user = await authUsers.create(ID.unique(), adminEmail, undefined, adminPassword, adminName);
                userId = user.$id;
            }
        } catch (e) {
            console.error('Error handling admin user:', e.message);
        }

        if (userId) {
            try {
                await teams.createMembership(adminTeamId, adminEmail, ['owner'], 'http://localhost:3000', adminName, userId);
            } catch (e) {}
        }

        console.log('Setup complete!');
    } catch (error) {
        console.error('Error during setup:', error.message);
        process.exit(1);
    }
}

setup();
