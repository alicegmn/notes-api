# Notes API

A simple, secure, and modern RESTful API for creating, managing, and authenticating notes. Built with Node.js, Express, TypeScript, PostgreSQL, JWT authentication, and includes Swagger documentation.

## Features

- User registration and login with JWT-based authentication
- CRUD endpoints for notes (Create, Read, Update, Delete)
- Secure password storage using bcrypt
- User roles for access control (admin, user)
- PostgreSQL database (compatible with Neon and local Postgres)
- TypeScript for type safety
- OpenAPI/Swagger documentation at `/api/docs`
- Automatic database schema creation on startup
- Modern project structure

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database (local, Neon, or other provider)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alicegmn/notes-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the project root with **either** of these options (replace values with your own credentials):

   **A. Recommended local setup (separate fields):**

   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DB_HOST=localhost
   DB_PORT=5432
   PORT=3000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```

   **B. Alternative setup (Postgres URL):**

   ```env
   DATABASE_URL=your_postgres_connection_url
   PORT=3000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   ```

   > Use option A for local Postgres. For services like Neon, use option B (the connection URL).

4. **Database initialization:**

   You do **not** need to run any manual SQL scripts to set up your tables. The required tables (`users` and `notes`) are created automatically each time the server starts, thanks to the built-in initialization in the code:

   ```js
   // Initialize the application
   app.listen(PORT, async () => {
     await initDB();
     console.log(`Server is running on port http://localhost:${PORT}`);
   });
   ```

   > This ensures your database is always up to date when you start the API.

   **Reference table schemas:**

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

   Use npm scripts to build and run the project:

   - `npm run dev` – Start the server in development mode with auto-reload (recommended during development)
   - `npm run build` – Build the project (compile TypeScript)
   - `npm start` – Run the compiled server (for production)

   The API will be available at `http://localhost:3000/api`.

6. **Access the Swagger docs:**

   Visit [http://localhost:3000/api/docs](http://localhost:3000/api/docs) for the full API documentation and to try out endpoints directly in your browser.

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
├── controllers/        # Request/response logic for each route
├── db/                 # Database connection
├── middlewares/        # Custom Express middlewares (auth, error handling)
├── routes/             # API route definitions (users, notes)
├── schemas/            # Request/response validation schemas (e.g. Zod, Joi or TypeScript types)
├── swagger/            # Swagger config & docs
├── utils/              # Utility functions
└── index.ts            # Server entrypoint (Express app + startup)
```

## API Documentation

- Available at `/api/docs` (Swagger UI)

## Contributing

PRs, issues, and feedback are welcome!

## License

MIT

