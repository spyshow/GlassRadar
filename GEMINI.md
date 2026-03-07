# GlassRadar - AI Context & Instructions

GlassRadar is a local-first, full-stack real-time monitoring and analytics system designed for glass manufacturing facilities. It provides live dashboards for machine status, production data, job changes, and inter-departmental communication.

## Project Overview
- **Backend:** [Appwrite](https://appwrite.io/) (Authentication, Database, Real-time, Storage)
- **Frontend:** [refine.dev](https://refine.dev/) (React-based framework for data-heavy applications)
- **UI Components:** Ant Design (inferred from planning documents)
- **Infrastructure:** Docker & Docker Compose
- **DevOps:** GitHub Actions & Docker Hub (planned)

## Architecture
- **Local-First:** Optimized for ultra-low latency within facility networks.
- **Containerized:** Fully Docker-based for portability and consistency across environments.

## Development Workflow: Conductor
This project strictly adheres to the **Conductor** methodology. AI agents must follow these mandates:

1.  **Plan is the Source of Truth:** All work MUST be tracked in `conductor/tracks/<track_id>/plan.md`.
2.  **Sequential Task Execution:** Complete tasks strictly in the order listed in the plan.
3.  **Test-Driven Development (TDD):**
    -   **Red Phase:** Write failing unit tests before any implementation.
    -   **Green Phase:** Implement the minimal code to pass the tests.
    -   **Refactor Phase:** Improve code quality while maintaining passing tests.
4.  **Verification Protocol:**
    -   Every task completion requires automated test verification.
    -   Every phase completion requires a **Checkpoint Commit** and a **Manual Verification Plan** presented to the user.
5.  **Git Notes for Auditability:** Every completed task must have a detailed summary attached to its commit using `git notes`.
6.  **Quality Gates:** Target >80% code coverage, enforced type safety (TypeScript), and strict adherence to style guides in `conductor/code_styleguides/`.

## Key Commands (TODO: Update as scaffolding completes)
- **Infrastructure:** `docker-compose up -d`
- **Frontend Dev:** `npm run dev` (from `./frontend` - once scaffolded)
- **Testing:** `npm test` or `CI=true npm test`

## Project Structure
- `conductor/`: Contains the project definition, workflow, tech stack, and implementation tracks.
- `docker-compose.yml`: Defines the Appwrite and Frontend services.
- `tests/`: Project-wide test suites.
- `frontend/`: (To be scaffolded) refine.dev application.
