import { z } from "zod";

export const createNoteSchema = z.strictObject({
  content: z.string().trim().min(1).max(2000),
});

export const noteParamsSchema = z.strictObject({ id: z.uuid() });
export const noQuerySchema = z.strictObject({});

export const noteResponseSchema = z.strictObject({
  id: z.uuid(),
  content: z.string().min(1).max(2000),
  createdAt: z.iso.datetime(),
});
