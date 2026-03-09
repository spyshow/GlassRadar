const sdk = require('node-appwrite');

module.exports = async function (context) {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const users = new sdk.Users(client);
  const teams = new sdk.Teams(client);

  context.log('Function triggered!');
  
  let payload = context.req.body;
  if (typeof payload === 'string') {
    try {
        payload = JSON.parse(payload);
    } catch (e) {
        context.error('Failed to parse payload as JSON');
    }
  }

  // Handle both Create and Update events
  const { userId, email, password, name, role } = payload;

  context.log(`Processing sync for: ${email} (ID: ${userId}, Role: ${role})`);

  if (!email) {
    context.error('Missing required field: email');
    return context.res.json({ success: false, error: 'Missing email' }, 400);
  }

  try {
    let authUser;
    
    // Check if user already exists
    try {
        authUser = await users.get(userId);
        context.log('Auth user found, checking for updates...');
        
        // Update password if provided
        if (password && password.length >= 8) {
            context.log('Updating password...');
            await users.updatePassword(userId, password);
            context.log('Password updated.');
        }
        
        // Update name if changed
        if (name) {
            await users.updateName(userId, name);
        }

    } catch (e) {
        // User doesn't exist, create it
        if (password && password.length >= 8) {
            context.log('Auth user not found, creating new account...');
            authUser = await users.create(userId || sdk.ID.unique(), email, undefined, password, name);
            context.log('Auth account created successfully:', authUser.$id);
        } else {
            context.error('Cannot create user without a valid password.');
            return context.res.json({ success: false, error: 'Password required for new users' }, 400);
        }
    }

    // 2. If the user is an admin, add them to the 'admin' team
    if (role === 'admin') {
      context.log('Ensuring user is in admin team...');
      try {
        await teams.createMembership('admin', email, ['owner'], 'http://localhost:3000', name || 'User', userId);
        context.log('Verified in admin team.');
      } catch (e) {
        context.log('Team membership logic complete (might already exist).');
      }
    }

    return context.res.json({
      success: true,
      message: `Successfully synced user ${userId}`,
    });
  } catch (error) {
    context.error(`Critical Sync Error: ${error.message}`);
    return context.res.json({
      success: false,
      error: error.message,
    }, 500);
  }
};
