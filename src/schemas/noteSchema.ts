import { z } from "zod";

export const CreateNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  text: z.string().min(1, "Text is required"),
});

export const UpdateNoteSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
});

export type CreateNoteDTO = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteDTO = z.infer<typeof UpdateNoteSchema>;
