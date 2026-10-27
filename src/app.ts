import cookieParser from "cookie-parser";
import express, { type ErrorRequestHandler } from "express";
import createError, { type HttpError } from "http-errors";
import logger from "morgan";
import path from "node:path";

import type { Database } from "./database.ts";
import { ApiError, apiErrorHandler } from "./http/problem.ts";
import { createNotesRouter } from "./modules/notes/router.ts";
import indexRouter from "./routes/index.ts";
import usersRouter from "./routes/users.ts";

export function createApp(db: Database) {
  const app = express();

  app.set("views", path.join(import.meta.dirname, "../views"));
  app.set("view engine", "pug");

  app.use(logger("dev"));

  const api = express.Router();
  api.use(express.json({ limit: "16kb" }));
  api.use("/notes", createNotesRouter(db));
  api.use(() => {
    throw new ApiError(404, "API resource not found.");
  });
  api.use(apiErrorHandler);
  app.use("/api", api);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(import.meta.dirname, "../public")));

  app.use("/", indexRouter);
  app.use("/users", usersRouter);

  app.use((_req, _res, next) => {
    next(createError(404));
  });

  const errorHandler: ErrorRequestHandler = (err: HttpError, req, res, _next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  };

  app.use(errorHandler);
  return app;
}
