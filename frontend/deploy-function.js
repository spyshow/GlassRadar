import { Client, Functions, ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.APPWRITE_API_KEY;
const PROJECT_ID = process.env.APPWRITE_PROJECT || 'glassradar';
const ENDPOINT = 'http://localhost/v1';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const functions = new Functions(client);

async function deploy() {
    const functionName = 'Sync User Auth';
    const functionId = 'sync-user-auth';
    const runtime = 'node-18.0';
    // Use wildcard for database ID to be safer
    const events = [
        'databases.*.collections.users.documents.*.create',
        'databases.*.collections.users.documents.*.update'
    ];

    try {
        console.log(`Checking if function "${functionName}" exists...`);
        try {
            await functions.get(functionId);
            console.log('Function exists.');
            
            console.log('Updating function settings and events...');
            await functions.update(
                functionId,
                functionName,
                runtime,
                ['any'],
                events
            );
        } catch (e) {
            console.log('Function does not exist, creating...');
            await functions.create(
                functionId,
                functionName,
                runtime,
                ['any'],
                events
            );
            console.log('Function created.');
        }

        // Set Environment Variables
        const vars = {
            'APPWRITE_FUNCTION_ENDPOINT': 'http://appwrite.local/v1',
            'APPWRITE_FUNCTION_PROJECT_ID': PROJECT_ID,
            'APPWRITE_FUNCTION_API_KEY': API_KEY
        };

        for (const [key, value] of Object.entries(vars)) {
            try {
                await functions.createVariable(functionId, key, value);
                console.log(`Variable ${key} created.`);
            } catch (e) {
                console.log(`Variable ${key} exists.`);
            }
        }

        console.log('Packaging code...');
        const functionDir = path.resolve(__dirname, 'functions/sync-user-auth');
        const tarPath = path.resolve(__dirname, 'code.tar.gz');
        execSync(`tar -czf "${tarPath}" -C "${functionDir}" .`);
        console.log('Code packaged.');

        console.log('Uploading deployment...');
        const deployment = await functions.createDeployment(
            functionId,
            InputFile.fromPath(tarPath, 'code.tar.gz'),
            true,
            'index.js',
            'npm install'
        );
        console.log('Deployment triggered successfully!');
        console.log(`Deployment ID: ${deployment.$id}`);

        fs.unlinkSync(tarPath);
        
    } catch (error) {
        console.error('Deployment failed:', error.message);
        if (error.response) console.error(JSON.stringify(error.response, null, 2));
    }
}

deploy();
