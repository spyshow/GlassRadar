# Implementation Plan: User Authentication and Management

## Phase 1: Backend Setup (Appwrite) [checkpoint: 34aadd0]
- [x] Task: Create `users` collection in Appwrite (f8f4170)
    - [x] Define attributes: `userId` (string), `email` (string), `name` (string), `role` (enum: admin, IS operator, QC, QA, mold tech, mold HoS, Production HoS, QA manager), `avatar` (string), `position` (string)
    - [x] Set collection permissions (Admin: CRUD, Users: Update own document, Read all)
- [x] Task: Configure Appwrite Auth Settings (f8f4170)
    - [x] Ensure Email/Password provider is enabled
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Setup' (Protocol in workflow.md) (34aadd0)

## Phase 2: Core Authentication Logic (Frontend) [checkpoint: 7b1c4d6]
- [x] Task: Implement Appwrite Auth Provider in Refine (36a21bc)
    - [x] Write failing tests for `login`, `logout`, `checkAuth`, `getPermissions`, `getIdentity`
    - [x] Implement `authProvider` methods using Appwrite SDK
    - [x] Verify tests pass
- [x] Task: Create Login Page UI (266e18d)
    - [x] Write failing tests for login form submission
    - [x] Implement Login page using Ant Design and Refine
    - [x] Verify tests pass
- [x] Task: Setup Access Control (Dashboard Exception) (9329065)
    - [x] Write failing tests for route protection (Dashboard public, others private)
    - [x] Configure access rules
    - [x] Verify tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Authentication Logic' (Protocol in workflow.md) (7b1c4d6)

## Phase 3: User Management CRUD (Admin Only) [checkpoint: cf3edcf]
- [x] Task: Implement User List Table (266e18d)
    - [x] Write failing tests for fetching/displaying users
    - [x] Implement `<UserList />` with all fields
    - [x] Verify tests pass
- [x] Task: Implement Admin User Create/Edit (Drawer/Modal) (266e18d)
    - [x] Write failing tests for admin-led creation/editing
    - [x] Implement `<UserCreate />` and `<UserEdit />` including Role assignment
    - [x] Verify tests pass
- [x] Task: Implement User Delete (266e18d)
    - [x] Write failing tests for deletion
    - [x] Add delete functionality to the admin table
    - [x] Verify tests pass
- [x] Task: Conductor - User Manual Verification 'Phase 3: User Management CRUD' (Protocol in workflow.md) (cf3edcf)

## Phase 4: Self-Profile & Access Control
- [ ] Task: Implement Self-Profile Editing
    - [ ] Write failing tests for user updating their own profile (Name, Avatar, Position)
    - [ ] Create Profile page for authenticated users
    - [ ] **Security:** Prevent users from changing their own `role`
    - [ ] Verify tests pass
- [ ] Task: Enforce Role-Based UI Elements
    - [ ] Write failing tests for role-based navigation visibility
    - [ ] Restrict Admin-only routes and menu items
    - [ ] Verify tests pass
- [ ] Task: Final Coverage & Linting Check
    - [ ] Run test coverage and ensure >80%
    - [ ] Run linting and fix any issues
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Self-Profile & Access Control' (Protocol in workflow.md)