import { z } from "zod";

// Schema for creating a note (requires both title and text)
export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title can be max 50 characters"),
  text: z
    .string()
    .min(1, "Text is required")
    .max(300, "Text can be max 300 characters"),
});

// Schema for updating a note with PUT (requires both fields, same rules as create)
export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(50),
  text: z.string().min(1).max(300),
});

// Schema for patching a note (at least one of the fields is required)
export const PatchNoteSchema = z
  .object({
    title: z.string().min(1).max(50).optional(),
    text: z.string().min(1).max(300).optional(),
  })
  .refine((data) => data.title !== undefined || data.text !== undefined, {
    message: "At least one field (title or text) must be provided.",
  });

// Types for request bodies (optional, for use in TypeScript)
export type CreateNoteDTO = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteDTO = z.infer<typeof UpdateNoteSchema>;
export type PatchNoteDTO = z.infer<typeof PatchNoteSchema>;
