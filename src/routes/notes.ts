import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  patchNote,
  deleteNote,
  searchNotes,
} from "../controllers/noteController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API endpoints for managing user notes
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notes
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, getNotes);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to retrieve
 *     responses:
 *       200:
 *         description: The note was found
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", requireAuth, getNoteById);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update an existing note (full update)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", requireAuth, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   patch:
 *     summary: Partially update a note (title or text)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id", requireAuth, patchNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", requireAuth, deleteNote);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Search notes by title or text content
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search string to match against note title or text
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       400:
 *         description: Query string missing or empty
 *       500:
 *         description: Internal server error
 */
router.get("/search", requireAuth, searchNotes);

export default router;
