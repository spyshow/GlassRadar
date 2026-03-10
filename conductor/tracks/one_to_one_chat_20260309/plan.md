# Implementation Plan: One-to-One Messaging

## Phase 1: Backend Schema Update
- [x] Task: Update `messages` collection in Appwrite (32600)
    - [x] Add `recipientId` (string, optional)
    - [x] Add `isPrivate` (boolean, required, default: false)
    - [x] Update collection permissions to allow `team:admin` global read/delete.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Schema Update' (Protocol in workflow.md)

## Phase 2: Staff Directory & DM Logic [checkpoint: ef75dd4]
- [x] Task: Implement Staff List in Chat Sidebar (d852270)
    - [x] Fetch users from `users` collection.
    - [x] Update `<ChatPage />` to display staff.
- [x] Task: Implement Private Channel ID Logic (c09d516)
    - [x] Create utility to generate consistent room IDs for pairs of users.
- [x] Task: Update `<ChatWindow />` for DMs (ab81629)
    - [x] Handle `recipientId` and `isPrivate` flag during message creation.
- [x] Task: Write tests for DM room generation and filtering (ab81629)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Staff Directory & DM Logic' (Protocol in workflow.md) (ef75dd4)

## Phase 3: Admin Oversight & Deletion
- [x] Task: Implement Admin Delete functionality in Chat (a9ab6e5)
    - [x] Add `DeleteButton` to `<MessageItem />` visible only to Admins.
- [x] Task: Verify Admin can see all messages in any channel/DM. (a9ab6e5)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Admin Oversight & Deletion' (Protocol in workflow.md) (a9ab6e5)

## Phase 4: Final Verification
- [~] Task: Final Coverage & Linting Check
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)
