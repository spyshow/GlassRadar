# Track Specification: Infrastructure and Role-Based User Authentication

## Overview
Establish the foundational infrastructure for GlassRadar, including containerized environments, backend services (Appwrite), and the frontend framework (Refine.dev). Implement a secure, role-based authentication system where registration is disabled, and only administrators can provision new accounts with specific operational roles.

## User Stories
- **As an Admin:** I want to create user accounts for staff and assign them specific roles (Admin, IS Operator, QC, QA, HoS, Mold Tech) so that I can control access to the system.
- **As a Staff Member:** I want to log in using my credentials so that I can access the tools relevant to my role.

## Requirements
- **Infrastructure:** Docker Compose setup for local development and production simulation.
- **Backend:** Appwrite project initialized with Auth and Database services.
- **Frontend:** Refine.dev scaffolded with TypeScript and Ant Design.
- **Authentication:** Custom Auth Provider in Refine connecting to Appwrite.
- **Roles:** Support for Admin, IS Operator, QC, QA, HoS, and Mold Tech roles.
- **User Provisioning:** A dedicated interface for Admins to create users (Registration is disabled for the public).