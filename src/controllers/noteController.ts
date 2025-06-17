import {
  CreateNoteSchema,
  UpdateNoteSchema,
  PatchNoteSchema,
} from "../schemas/noteSchema.js";
import { Request, Response } from "express";
import pool from "../db/pool.js";

// Get all notes for the authenticated user
export async function getNotes(req: Request, res: Response) {
  const userId = req.user!.id;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get a single note by its ID for the authenticated user
export async function getNoteById(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;
  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    const note = result.rows[0];
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    res.json({ success: true, note });
  } catch (err) {
    console.error("Fetch single note error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Create a new note for the authenticated user
export async function createNote(req: Request, res: Response) {
  // Validate request body using Zod schema
  const parsed = CreateNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }
  const { title, text } = parsed.data;
  const userId = req.user!.id;
  try {
    const result = await pool.query(
      `INSERT INTO notes (title, text, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, text, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Update a note (full update) for the authenticated user
export async function updateNote(req: Request, res: Response) {
  // Validate request body using Zod schema
  const parsed = UpdateNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }
  const { id } = req.params;
  const { title, text } = parsed.data;
  const userId = req.user!.id;
  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1,
           text = $2,
           modified_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, text, id, userId]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Partially update a note (patch) for the authenticated user
export async function patchNote(req: Request, res: Response) {
  // Validate request body using Zod schema
  const parsed = PatchNoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }
  const { id } = req.params;
  const { title, text } = parsed.data;
  const userId = req.user!.id;
  try {
    const fields = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (text !== undefined) {
      fields.push(`text = $${paramIndex++}`);
      values.push(text);
    }
    // Always update modified_at timestamp
    fields.push(`modified_at = CURRENT_TIMESTAMP`);
    values.push(id);
    values.push(userId);

    const query = `
      UPDATE notes
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found or not yours",
      });
    }
    return res.json({
      success: true,
      message: "Note updated",
      note: result.rows[0],
    });
  } catch (err) {
    console.error("Patch note error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Delete a note for the authenticated user
export async function deleteNote(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;
  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Search notes by title or text content for the authenticated user
export async function searchNotes(req: Request, res: Response) {
  const userId = req.user!.id;
  const query = req.query.query as string;

  if (!query || query.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Query is required" });
  }

  try {
    // Prepare search string with wildcards for ILIKE
    const search = `%${query}%`;

    const result = await pool.query(
      `
      SELECT *
      FROM notes
      WHERE user_id = $1 AND (
        title ILIKE $2 OR
        text ILIKE $2
      )
      ORDER BY modified_at DESC
      `,
      [userId, search]
    );

    res.json({ success: true, results: result.rows });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
