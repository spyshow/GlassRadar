# Specification: One-to-One Messaging

## Overview
Extends the Industrial Chat Loop to support private direct messages between staff members, while ensuring administrators can monitor and manage all communications for safety and compliance.

## Functional Requirements
- **Direct Messaging (DM):** Users can select another staff member and start a private conversation.
- **Admin Oversight:** Administrators can see all private messages in a dedicated "Global Logs" or within the chat UI.
- **Admin Management:** Administrators can delete any message (public or private).
- **Notification:** Users should see a list of available users to chat with.

## Technical Design

### Backend (Appwrite)
- **Collection:** `messages` (Update existing)
- **New Attributes:**
    - `recipientId` (string, optional): Appwrite User ID of the receiver.
    - `isPrivate` (boolean, required): Flag to distinguish between channel and direct messages.
- **Revised Permissions:**
    - `read`: 
        - Role `team:admin` (Always allowed).
        - Document-level security: `user:${senderId}` and `user:${recipientId}`.
    - `create`: Role `any` (Authenticated).
    - `update/delete`: Role `team:admin`.

### Frontend (Refine + Ant Design)
- **Chat Sidebar:** Add a "Staff" section listing all users from the `users` collection.
- **Channel Logic:**
    - For DMs, the `channel` field will be set to a composite string: `private_${min(id1, id2)}_${max(id1, id2)}`.
    - This ensures both users land in the same "room".
- **Access Control:** `accessControlProvider` must be updated if document-level security is not sufficient.

## Acceptance Criteria
- [ ] Users can start a DM with any other registered staff member.
- [ ] DMs are private between the two participants (and admins).
- [ ] Admins can view and delete DMs from the chat UI.
- [ ] Real-time sync works for DMs just like public channels.
