import { Client, Databases, Role, Permission } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const client = new Client()
    .setEndpoint('http://localhost/v1') // Assuming localhost for host-based setup
    .setProject(process.env.APPWRITE_PROJECT || 'glassradar')
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function setup() {
    const dbId = 'default';
    const collId = 'users';

    try {
        console.log('Creating database "default" if it doesn\'t exist...');
        try {
            await databases.create(dbId, 'Default Database');
        } catch (e) {
            console.log('Database might already exist.');
        }

        console.log('Creating "users" collection...');
        await databases.createCollection(dbId, collId, 'Users', [
            Permission.read(Role.any()),
            Permission.write(Role.team('admin')),
            Permission.update(Role.label('admin')),
            Permission.delete(Role.label('admin')),
        ]);

        console.log('Creating attributes...');
        await databases.createStringAttribute(dbId, collId, 'userId', 255, true);
        await databases.createEmailAttribute(dbId, collId, 'email', true);
        await databases.createStringAttribute(dbId, collId, 'name', 255, true);
        await databases.createEnumAttribute(dbId, collId, 'role', [
            'admin', 'IS operator', 'QC', 'QA', 'mold tech', 'mold HoS', 'Production HoS', 'QA manager'
        ], true);
        await databases.createUrlAttribute(dbId, collId, 'avatar', false);
        await databases.createStringAttribute(dbId, collId, 'position', 255, false);

        console.log('Setup complete! Waiting for attributes to index...');
    } catch (error) {
        console.error('Error during setup:', error.message);
        if (error.message.includes('already exists')) {
            console.log('Skipping creation as it already exists.');
        } else {
            process.exit(1);
        }
    }
}

setup();
