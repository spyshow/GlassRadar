# GlassRadar Technology Stack

## Core Languages
- **TypeScript:** Primary language for both the frontend (Refine.dev) and custom backend logic, ensuring type safety and developer productivity.
- **Node.js:** Core runtime for executing custom backend services and automation scripts.
- **YAML & Shell:** For defining Docker configurations, CI/CD pipelines, and system automation.

## Backend & Storage
- **Appwrite:** An open-source, local-first backend platform providing:
  - **Authentication:** Secure user management for operators and technicians.
  - **Database:** Flexible NoSQL-like storage for machine logs, production data, and mold tracking.
  - **Real-time:** Native WebSocket support for live dashboard updates and instant chat messaging.
  - **File Storage:** Handling documentation and defect images.
- **Node.js (Custom Services):** Dedicated services for complex data processing or integration tasks not handled by Appwrite natively.

## Frontend Frameworks
- **Refine.dev (React):** A high-level framework specialized for rapid development of data-intensive administrative and monitoring interfaces. (Skill: `react-best-practices`)
- **Ant Design:** The primary UI component library, providing a professional and standardized industrial look and feel. (Skills: `frontend-design`, `animejs-animation`)
- **React Query:** Managing server state and caching for ultra-responsive data fetching. (Skill: `tanstack-query-expert`)
- **Appwrite Web SDK:** For seamless integration with the backend and real-time event handling.

## Deployment & Environments
- **Containerization:** All system components are containerized using **Docker** and orchestrated via **Docker Compose** for consistent behavior across hosts. (Skill: `docker-expert`)
- **Configuration Management:** An environment variable strategy using `.env` (development) and `.env.prod` (production) files is used to manage environment-specific settings.
- **Dual Environments:**  - **Development/Test:** Hosted locally on developer machines for rapid iteration.
  - **Production:** High-availability server environment deployed within the facility network.
- **Remote Access:** **ngrok** is utilized during testing phases to allow secure access to the production environment from the internet.

## Infrastructure & CI/CD
- **GitHub Actions:** Automates the testing and build process upon every code push. (Skills: `devops-deploy`, `devops-troubleshooter`)
- **Docker Hub:** Acts as the central registry for storing and versioning container images.
- **Local Networking:** Configured for local DNS/IP access to ensure the system remains functional and responsive within the factory’s physical network boundaries.