# zingping

zingping is a modern web-based chat application that allows users to connect, chat, and make video calls with friends in real-time. The platform is designed for seamless communication, featuring friend management, instant messaging, and high-quality video calls.

## Architecture

The application follows a client-server architecture. The frontend is built with Next.js and communicates with the backend via REST APIs and WebSockets for real-time features. The backend, powered by Express, manages user authentication, messaging, and video call signaling. Data is stored in PostgreSQL, and Redis is used for caching and session management.

<!-- Example image usage: -->
<!-- ![Architecture Diagram](/images/zingping-architecture.png) -->

### Folder Structure

```
zingping/
  apps/
    server/   # Express backend, API, WebSocket, DB, Redis
    web/      # Next.js frontend, UI, client logic
  packages/
    ui/       # Shared UI components (ShadCN-based)
    typescript-config/
    eslint-config/
  .github/
    workflows/ # CI/CD workflows
  package.json
  turbo.json   # Monorepo build orchestration
  pnpm-workspace.yaml
```

## Technologies Used

- **Next.js**: For building the frontend and server-side rendering.
- **ShadCN**: Provides a set of accessible and customizable UI components.
- **Tanstack Query**: Handles data fetching, caching, and state management on the client.
- **Express**: Backend framework for handling API requests and business logic.
- **Socket.io**: Enables real-time communication for chat and video calls.
- **PostgreSQL**: Relational database for storing user and message data.
- **Redis**: Used for caching and managing user sessions efficiently.
- **Prisma**: ORM for type-safe database access.
- **TurboRepo**: Monorepo build and task orchestration.
- **PNPM**: Fast, disk space-efficient package manager.

## Getting Started

### Prerequisites

- Node.js >= 18
- PNPM >= 9
- PostgreSQL
- Redis

### Installation

```bash
pnpm install
```

### Development

Start all apps in development mode:

```bash
pnpm dev
```

- The frontend will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:4000` (or as configured)

### Build

```bash
pnpm build
```

## Docker

zingping is fully containerized for easy local development and production deployment.

- The backend server (`apps/server`) includes a `Dockerfile` for building the Node.js application image.
- A `docker-compose.yaml` file orchestrates the backend server, PostgreSQL, and Redis services.

**Key services:**
- `zingping-api`: The Express backend, built from the local Dockerfile.
- `db`: PostgreSQL database, with persistent storage and health checks.
- `redis`: Redis instance for caching and session management, with append-only persistence.

**To start all services locally:**
```bash
cd apps/server
docker-compose up --build
```
This will launch the API server on port 8080, PostgreSQL on 5432, and Redis on 6379.

## CI/CD

zingping uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The workflow is defined in `.github/workflows/ci-server.yaml` and is triggered on pushes and pull requests to the `main` branch for the backend server.

**Workflow steps:**
- Checks out the repository code.
- Sets up Docker Buildx for advanced Docker builds.
- Logs in to Docker Hub using repository secrets.
- Builds the backend server Docker image (`sid00100/zingping:latest`) from the `apps/server` directory.
- Pushes the built image to Docker Hub.

This ensures that every change to the backend is automatically built and published as a Docker image, ready for deployment.

## Features

- User authentication and registration
- Add, remove, and manage friends
- Real-time chat with message history
- Video calls with friends
- Responsive, accessible UI
- Optimistic updates and caching with Tanstack Query

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run lint and tests
5. Submit a pull request

## License

MIT
