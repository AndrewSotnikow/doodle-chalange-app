# Doodle Frontend Challenge API

Welcome to the Doodle Frontend Challenge! This repository contains a chat API using MongoDB for storage that you'll use as the backend for your frontend implementation.

## Overview

As part of the challenge, you'll be building a chat interface that connects to this API. We've provided a containerized backend to ensure you can focus entirely on the frontend implementation without worrying about server side complexities.

### What's Included

This API provides the core functionality you'll need:

- Fetching existing chat messages
- Creating new messages
- Real time message updates
- Authentication

The API comes with:

- Full Swagger documentation for easy exploration
- Built in CORS support for local development
- Error handling and validation with detailed logging
- Docker containerization for consistent behavior
- MongoDB integration for persistent storage
- Initial seed data for chat messages

## Option 1: Running with Docker (RECOMMENDED)

### Prerequisites

#### Docker

Install Docker for your operating system by following the [official installation guides](https://docs.docker.com/).

#### System Requirements

- At least 4GB of RAM
- Ports 3000 and 27017 must be available
- Internet connection for pulling Docker images

### Running the API with Docker

1. Start the API and MongoDB:

   ```bash
   docker compose up
   ```

   To run in detached mode:

   ```bash
   docker compose up -d
   ```

2. To stop the services:

   ```bash
   docker compose down
   ```

3. To clean up completely (including volumes):

   ```bash
   docker compose down -v
   ```

## Option 2: Local Development (Without Docker)

### Prerequisites

#### Node.js

Install Node.js v20 or higher by downloading it from https://nodejs.org.

#### MongoDB

Install MongoDB by following the [official installation guide](https://www.mongodb.com/).

### Starting MongoDB

Before running the API, ensure MongoDB is running. Use documentation based on how it was installed.

### Setup and Installation

1. Set up environment variables:

```bash
# Unix/Mac
cp .env.example .env

# Windows
copy .env.example .env
```

2. Install dependencies:

```bash
npm install
```

### Running the API Locally

For development (with hot reload):

```bash
npm run dev
```

For production build:

```bash
npm run build
npm start
```

The server will start on http://localhost:3000

## Verifying the API

After starting the API (either with Docker or locally), verify it's running by visiting:

- Health Check: http://localhost:3000/health

## Database Details

The API uses MongoDB for persistent storage with the following features:

- Automatic seeding of initial chat messages on first start
- Indexed createdAt field for efficient queries

## API Documentation

Once the server is running, you can access the Swagger documentation at:
`http://localhost:3000/api/v1/docs`

### Authentication

All message related endpoints require authentication via a Bearer token in the Authorization header.

#### Authentication Token

Use this token for all requests:

```
super-secret-doodle-token
```

#### Example Headers

```http
Authorization: Bearer super-secret-doodle-token
```

#### Testing with curl

```bash
# Get messages
curl http://localhost:3000/api/v1/messages \
  -H "Authorization: Bearer super-secret-doodle-token"

# Create message
curl -X POST http://localhost:3000/api/v1/messages \
  -H "Authorization: Bearer super-secret-doodle-token" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "author": "John Doe"}'
```

#### Error Responses

Requests without proper authentication will receive a 401 Unauthorized response.

### Key Endpoints

#### GET /api/v1/messages

Retrieve chat messages with optional pagination and filtering.

Query Parameters:

- `limit` (optional): Maximum number of messages to return (default: 50)
- `after` (optional): Return messages created after the provided Date
- `before` (optional): Return messages created before the provided Date

#### POST /api/v1/messages

Create a new chat message.

Request Body:

```json
{
  "message": "Hello",
  "author": "John Doe"
}
```

#### GET /health

Health check endpoint returning API status.

### Technical Details

- Built with Node.js and Express
- Written in TypeScript
- Uses MongoDB for message storage
- Includes request validation with detailed error logging

## Additional Information

1. The API runs in a container or locally, ensuring flexibility for different development preferences
2. Messages are stored in MongoDB, providing persistence across restarts
3. Swagger documentation provides interactive API testing capabilities

### Troubleshooting

#### Docker Issues:

If the container won't start:

```bash
docker compose logs -f api
```

If port 3000 is already in use:

```bash
# Check what's using the port
# Unix/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

#### Local Development Issues:

If you have dependency issues:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

If TypeScript build fails:

```bash
rm -rf dist
npm run build
```

## License

Copyright (c) 2025 Doodle AG. All rights reserved.
