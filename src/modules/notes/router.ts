import { Router } from "express";

import type { Database } from "../../database.ts";
import { ApiError } from "../../http/problem.ts";
import { createNoteSchema, noQuerySchema, noteParamsSchema } from "./schemas.ts";

const noteSelect = { id: true, content: true, createdAt: true } as const;

export function createNotesRouter(db: Database) {
  const router = Router();

  router.use((req, _res, next) => {
    if (!noQuerySchema.safeParse(req.query).success) {
      throw new ApiError(400, "Query parameters are not supported.");
    }
    next();
  });

  router.post("/", async (req, res) => {
    if (!req.is("application/json")) {
      throw new ApiError(415, "Expected application/json.");
    }
    const body = createNoteSchema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(400, "Expected only content containing 1 to 2000 nonblank characters.");
    }
    const note = await db.note.create({ data: body.data, select: noteSelect });
    res.location(`/api/notes/${note.id}`).status(201).json(note);
  });

  router.get("/:id", async (req, res) => {
    const params = noteParamsSchema.safeParse(req.params);
    if (!params.success) throw new ApiError(400, "Expected a UUID note identifier.");
    const note = await db.note.findUnique({ where: { id: params.data.id }, select: noteSelect });
    if (!note) throw new ApiError(404, "Note not found.");
    res.json(note);
  });

  router.delete("/:id", async (req, res) => {
    const params = noteParamsSchema.safeParse(req.params);
    if (!params.success) throw new ApiError(400, "Expected a UUID note identifier.");
    const result = await db.note.deleteMany({ where: { id: params.data.id } });
    if (result.count === 0) throw new ApiError(404, "Note not found.");
    res.status(204).end();
  });

  return router;
}
