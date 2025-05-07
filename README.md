# zingping

zingping is a modern web-based chat application that allows users to connect, chat, and make video calls with friends in real-time. The platform is designed for seamless communication, featuring friend management, instant messaging, and high-quality video calls.

## Architecture

zingping is a real-time chat and video call platform built on a robust, scalable client-server architecture:

- **Frontend**:  
  Built with **Next.js**, the frontend provides a modern, responsive UI and communicates with the backend via REST APIs and WebSockets for real-time features.

- **Backend**:  
  The backend is powered by **Express** and handles user authentication, friend management, messaging, and video call signaling. It exposes RESTful APIs and manages real-time events using **Socket.io**.

- **Database**:  
  **PostgreSQL** is used as the primary data store for users, messages, and friend relationships, accessed via **Prisma** ORM for type-safe queries.

- **Redis**:  
  Redis is a core part of the real-time infrastructure:
  - **Pub/Sub for Messaging**:  
    Redis channels are used to publish and subscribe to real-time chat messages. When a user sends a message, it is published to a Redis channel; subscribers (the backend) receive the message, persist it to the database, and deliver it to the recipient via WebSocket.
  - **Socket Connection Management**:  
    Redis hash maps are used to associate user emails with their active socket connection IDs. This enables the backend to efficiently route real-time events (like incoming messages) to the correct connected client, even in a distributed/multi-instance deployment.
  - **Session/State Management**:  
    While not used for traditional session storage, Redis is leveraged for ephemeral state (like socket-user mappings) to support horizontal scaling and stateless backend instances.

- **Monorepo & Tooling**:  
  The project uses **TurboRepo** for monorepo orchestration and **PNPM** for fast, space-efficient package management. Shared UI components (based on ShadCN) are managed in a separate package for reuse across the app.

### Redis Usage Details

- **Initialization**:  
  Redis clients are initialized using `ioredis`, with secure connection strings and environment-based configuration.
- **Pub/Sub**:  
  - The backend subscribes to a channel (e.g., `"ib"`) for incoming chat messages.
  - When a message is published, the backend:
    1. Parses the message.
    2. Looks up sender and receiver in the database.
    3. Persists the message.
    4. Looks up the receiver's socket ID from Redis.
    5. Emits the message to the receiver's socket via Socket.io.
- **Socket Mapping**:  
  - On connection, the backend stores mappings between socket IDs and user emails in Redis hash maps.
  - This allows efficient lookup and cleanup of socket-user associations, supporting real-time delivery and reconnections.

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