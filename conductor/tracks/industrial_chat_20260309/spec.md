# Specification: Industrial Chat Loop

## Overview
A real-time, industrial-grade communication loop enabling IS Operators, QC, QA, and Mold Technicians to synchronize on production issues instantly.

## Functional Requirements
- **Real-time Messaging:** Messages appear instantly without page refresh.
- **Departmental Filtering:** Ability to filter messages by department (IS, QC, QA, Mold).
- **Sender Identity:** Each message displays the sender's name, role (with color code), and position.
- **Timestamping:** Every message has a precise local timestamp.
- **Persistence:** Chat history is stored in Appwrite Database.

## Technical Design

### Backend (Appwrite)
- **Collection:** `messages`
- **Attributes:**
    - `content` (string, required): The message text.
    - `senderId` (string, required): Appwrite User ID.
    - `senderName` (string, required): Display name.
    - `senderRole` (string, required): Role for color coding.
    - `channel` (enum: general, IS, QC, QA, mold): The target department/channel.
    - `timestamp` (datetime, required): Message creation time.
- **Permissions:**
    - `read`: Role `any` (Authenticated).
    - `create`: Role `any` (Authenticated).
    - `update/delete`: Role `admin` or owner.

### Frontend (Refine + Ant Design)
- **Component:** `<ChatWindow />`
- **Hook:** `useList` with `liveMode: "auto"` for real-time updates.
- **UI:** A modern, scrolling message list with an input field at the bottom.

## Acceptance Criteria
- [ ] Users can send messages and see them appear immediately.
- [ ] Users see messages sent by others in real-time.
- [ ] Messages are correctly attributed to the sender.
- [ ] Admins can delete problematic messages.
