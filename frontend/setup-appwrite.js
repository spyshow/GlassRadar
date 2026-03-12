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
        console.log('Ensuring "messages" collection exists with Document Level Security...');
        const msgCollId = 'messages';
        // Collection level permissions: Admins can do everything. 
        // Users can Create. Read is handled at document level for DMs, 
        // or collection level for public channels.
        const msgPermissions = [
            Permission.read(Role.team('admin')),
            Permission.read(Role.users()), // For now, keep simple read for channels. We will filter in UI or set doc perms.
            Permission.create(Role.users()),
            Permission.update(Role.team('admin')),
            Permission.delete(Role.team('admin')),
        ];

        try {
            // Note: In Node SDK, documentSecurity is the 5th parameter of createCollection if supported, 
            // but it's usually set via updateCollection or during creation.
            await databases.createCollection(dbId, msgCollId, 'Messages', msgPermissions, true); 
            console.log('Messages collection created with DLS.');
        } catch (e) {
            console.log('Messages collection exists, updating permissions...');
            await databases.updateCollection(dbId, msgCollId, 'Messages', msgPermissions, true);
        }

        console.log('Creating/Updating attributes for one-to-one messaging...');
        const attributes = [
            { key: 'content', type: 'string', size: 5000, required: true },
            { key: 'senderId', type: 'string', size: 255, required: true },
            { key: 'senderName', type: 'string', size: 255, required: true },
            { key: 'senderRole', type: 'string', size: 255, required: true },
            { key: 'channel', type: 'string', size: 255, required: true }, // For DMs, this will be private room ID
            { key: 'timestamp', type: 'datetime', required: true },
            { key: 'recipientId', type: 'string', size: 255, required: false },
            { key: 'isPrivate', type: 'boolean', required: false, default: false }
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, msgCollId, attr.key, attr.size, attr.required);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, msgCollId, attr.key, attr.required, attr.default);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(dbId, msgCollId, attr.key, attr.required);
                }
                console.log(`Attribute "${attr.key}" created.`);
            } catch (e) {
                console.log(`Attribute "${attr.key}" exists or error.`);
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
