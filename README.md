# Notes API

A simple, secure, and modern RESTful API for creating, managing, and authenticating notes. Built with Node.js, Express, TypeScript, PostgreSQL, JWT authentication, and includes Swagger documentation.

## Features

- User registration and login with JWT-based authentication
- CRUD endpoints for notes (Create, Read, Update, Delete)
- Secure password storage using bcrypt
- User roles for access control (admin, user)
- PostgreSQL database (compatible with Neon)
- TypeScript for type safety
- OpenAPI/Swagger documentation at `/api/docs`
- Modern project structure

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database (e.g. Neon or local Postgres)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <REPO_URL>
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root with the following:

   ```env
   PORT=3000
   DATABASE_URL=your_postgres_connection_url
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Initialize your database:**

   Run the provided SQL scripts, or manually create the required tables:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(20) DEFAULT 'user'
   );

   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **Start the server:**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`.

6. **Access the Swagger docs:**

   Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs) for the full API documentation and try out endpoints directly in the browser.

## Usage

### Authentication

- Register a new user via `POST /users/register`
- Log in via `POST /users/login` to receive a JWT token
- Pass the JWT in the `Authorization: Bearer <token>` header for protected routes

### Example Endpoints

- `POST /users/register` — Register new user
- `POST /users/login` — Authenticate and get JWT
- `GET /notes` — Get notes for authenticated user
- `POST /notes` — Create a new note
- `PUT /notes/:id` — Update a note
- `DELETE /notes/:id` — Delete a note

## Project Structure

```
src/
├── db/                 # Database connection
├── middlewares/        # Custom Express middlewares (auth, error handling)
├── routes/             # API route definitions (users, notes)
├── swagger/            # Swagger config & docs
├── utils/              # Utility functions
├── app.ts              # Express app setup
└── server.ts           # Server entrypoint
```

## Scripts

- `npm run dev` — Start the server in development mode with auto-reload
- `npm run build` — Build TypeScript
- `npm start` — Run compiled server

## Deployment

- Ready to deploy on platforms like Vercel (API), Railway, or Render
- Compatible with serverless PostgreSQL providers like Neon

## API Documentation

- Auto-generated and available at `/api/docs` (Swagger UI)

## Contributing

PRs, issues, and feedback are welcome!

## License

MIT
