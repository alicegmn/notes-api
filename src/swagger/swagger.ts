// src/swagger.ts

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Swagger configuration options
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
      description:
        "A simple authenticated Notes API built with Node.js, Express, PostgreSQL and JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        // JWT Bearer authentication scheme definition
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // User-related schemas
        SignupInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Alice" },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: { type: "string", example: "password123" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: { type: "string", example: "password123" },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            name: { type: "string", example: "Alice" },
            email: { type: "string", example: "alice@example.com" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            token: { type: "string", example: "JWT_TOKEN_HERE" },
            user: { $ref: "#/components/schemas/UserResponse" },
          },
        },
        // Note-related schemas
        Note: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            text: { type: "string" },
            user_id: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            modified_at: { type: "string", format: "date-time" },
          },
        },
        CreateNote: {
          type: "object",
          required: ["title", "text"],
          properties: {
            title: { type: "string", example: "My Note" },
            text: {
              type: "string",
              example: "This is the content of the note.",
            },
          },
        },
        UpdateNote: {
          type: "object",
          properties: {
            title: { type: "string", example: "Updated Note" },
            text: { type: "string", example: "Updated content." },
          },
        },
        NoteResponse: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            title: { type: "string", example: "My Note" },
            text: { type: "string", example: "Note content here..." },
            user_id: { type: "number", example: 1 },
            created_at: { type: "string", format: "date-time" },
            modified_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    // Secure all endpoints with bearerAuth by default
    security: [{ bearerAuth: [] }],
  },
  // Path to the API routes containing JSDoc comments
  apis: ["./src/routes/*.ts"],
};

// Generate the Swagger specification from options
const swaggerSpec = swaggerJSDoc(options);

// Middleware function to set up Swagger UI at /api/docs
export function setupSwagger(app: Express) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
