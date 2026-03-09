# GlassRadar Engineering Mandates

## Mandatory Tool Usage
For every code modification or new feature implementation, the following tools MUST be employed for validation and integration:

1.  **Appwrite API:** Validate all backend operations, collections, and Cloud Functions using the Appwrite Node.js SDK or direct API calls.
2.  **Chrome DevTools:** Perform automated UI verification, performance analysis (LCP), and network inspection for all frontend changes.
3.  **Docker:** Build and test containers locally (`docker compose up --build`) to ensure environmental parity and build success.
4.  **GitHub MCP:** Manage branches, PRs, and synchronize with the remote repository following successful local validation.
5.  **Appwrite Docs MCP:** Consult `appwrite_doc` for all Appwrite-related technical information, SDK references, and best practices to ensure implementation accuracy.

## Verification Protocol
No change is considered "Done" until:
- [ ] Backend logic is verified via `appwrite_api`.
- [ ] Frontend UI is verified via `chrome-devtools` snapshots/scripts.
- [ ] The full stack builds successfully via `docker` (`tsc` and `refine build` check).
- [ ] All changes are staged and committed via `GitHub MCP`.
