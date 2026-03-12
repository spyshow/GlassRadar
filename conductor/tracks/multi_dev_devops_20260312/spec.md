# Specification: Multi-Developer DevOps Pipeline

## 1. Overview
The goal of this track is to implement a professional DevOps workflow that enables multiple developers to collaborate effectively. It introduces an "Inner Loop" for local development and an "Outer Loop" for automated testing (CI) and deployment (CD).

## 2. Functional Requirements
- **Local Development (Inner Loop):**
    - Support for multiple developers using feature branches (`feature/*`).
    - Standardized environment using `docker compose up`.
    - Hot-reloading and local test execution inside containers.
- **Continuous Integration (CI):**
    - Triggered on every `push` to any branch and every `pull_request` to `main`.
    - Automated building of "Test" Docker images.
    - Automated execution of frontend and backend test suites.
    - Block merges if tests fail.
- **Continuous Deployment (CD):**
    - Triggered on merge/push to the `main` branch.
    - Build optimized production-ready Docker images.
    - Push images to **Docker Hub**.
- **Automated Deployment:**
    - Use `nickfedor/watchtower` on the production server to monitor Docker Hub for image updates.
    - Automatically pull new images and restart production containers upon detection.

## 3. Technical Requirements
- **CI/CD Platform:** GitHub Actions.
- **Registry:** Docker Hub.
- **Secret Management:** GitHub Actions Secrets (for Docker Hub credentials and environment variables).
- **Deployment Agent:** Watchtower (`nickfedor/watchtower`).

## 4. Acceptance Criteria
- [ ] A developer can push to a feature branch and trigger an automated build/test run.
- [ ] A Pull Request shows the status of the CI checks.
- [ ] Merging a PR to `main` automatically pushes new images to Docker Hub.
- [ ] The production server automatically updates its containers when Docker Hub images change.
- [ ] No sensitive credentials (API keys, passwords) are committed to the repository.

## 5. Out of Scope
- Infrastructure provisioning (Cloud server setup).
- SSL certificate management (Assuming already handled).
- Advanced staging/blue-green deployment environments.