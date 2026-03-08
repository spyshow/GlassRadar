# Specification: User Authentication and Management

## Overview
Implement a secure authentication system using Appwrite and a user management interface using Refine.dev. This track covers the login process, user CRUD operations, and role-based access control.

## Functional Requirements
- **Authentication:**
    - Login screen with Email and Password.
    - "Remember Me" functionality.
    - "Forgot Password" workflow.
    - Public access to the Dashboard (to be implemented later).
    - Redirection to Login for all other protected routes.
- **User Management (Admin Only):**
    - List all users in a table view.
    - Create new users with specified levels/roles.
    - Edit existing user details and roles.
    - Delete/Disable users.
- **Self-Profile:**
    - Users can update their own profile (Name, Avatar, Position).
    - Users cannot change their own roles.
- **Roles/Levels:**
    - Support for levels: `admin`, `IS operator`, `QC`, `QA`, `mold tech`, `mold HoS`, `Production HoS`, `QA manager`.
    - Roles stored in a dedicated `users` collection in Appwrite for easier management and querying within the app.

## Non-Functional Requirements
- **Security:** Ensure roles are enforced on the backend (Appwrite Permissions/Collection Security).
- **UI/UX:** Use Ant Design components via Refine.dev for a professional industrial look. Use Drawers or Modals for CRUD operations to maintain context.

## Acceptance Criteria
- [ ] Users can log in and out successfully.
- [ ] Unauthenticated visitors can only access the Dashboard route.
- [ ] Admins can CRUD users and assign one of the 8 specified levels.
- [ ] Assigned roles correctly persist in the `users` collection.
- [ ] User management table displays current users and their assigned levels.
- [ ] Users can edit their own Name, Avatar, and Position.

## Out of Scope
- Implementation of the actual Dashboard content (only the route/access control logic).
- Multi-factor authentication (MFA).
- OAuth/Social login providers.