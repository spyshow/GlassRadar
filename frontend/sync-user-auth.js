import { Client, Users, Teams, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const users = new Users(client);
  const teams = new Teams(client);

  // Extract the newly created document from the event payload
  const document = req.body;
  const { userId, email, password, name, role } = document;

  log(`Processing new user document: ${userId} (${email})`);

  try {
    // 1. Create the Authentication Account
    log('Creating Auth account...');
    await users.create(userId, email, undefined, password, name);
    log('Auth account created successfully.');

    // 2. If the user is an admin, add them to the 'admin' team
    if (role === 'admin') {
      log('User has admin role. Adding to admin team...');
      try {
        await teams.createMembership('admin', email, ['owner'], process.env._APP_DOMAIN || 'http://localhost:3000', name, userId);
        log('Added to admin team.');
      } catch (e) {
        error(`Failed to add to admin team: ${e.message}`);
      }
    }

    return res.json({
      success: true,
      message: `Successfully synced user ${userId}`,
    });
  } catch (e) {
    error(`Error syncing user: ${e.message}`);
    return res.json({
      success: false,
      error: e.message,
    }, 500);
  }
};
