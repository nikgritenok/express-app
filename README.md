# express-app

Backend starter for a hackathon: Express 5, strict TypeScript, PostgreSQL 17, Prisma 7, Zod and Vitest. The OpenAPI document is generated from the same Zod schemas that validate requests, so the docs cannot drift away from the code.

## What is inside

- `src/modules/notes/` is the reference module: strict schemas plus one registration that wires a route for Express and for OpenAPI.
- `/docs` serves Scalar over the generated `/openapi.json`, with Test Request buttons that send real calls.
- Errors under `/api` come back as `application/problem+json` with stable codes. Unknown failures never leak SQL, stack traces or secrets.
- `pnpm verify` runs formatting, lint, types, tests and build in that order and stops on the first failure.

## Example

```bash
curl -i -X POST http://localhost:3000/api/notes \
  -H 'content-type: application/json' \
  -d '{"content":"Note"}'
```

```
HTTP/1.1 201 Created
Location: /api/notes/1
{"id":1,"content":"Note","createdAt":"2026-10-27T20:41:00.000Z"}
```

Bad input answers 400, an unsupported media type 415, a body over 16 KiB 413. `content` is trimmed and must hold 1 to 2000 Unicode code points, so one emoji counts as one character while a base letter with a separate combining mark counts as two.

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

Without Docker: Node 24 LTS and pnpm 12.14.0, then `pnpm install`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm dev`.

The setup section of the Russian documentation walks through Git and Docker installation for Windows, macOS and Linux, for people who have never run a container.

## Configuration

`.env.example` holds the database URL, the HTTP port and the JWT secret. Compose passes its own values into the container, so `docker compose up` works with the default file.

## When to use it

A team that needs a typed backend skeleton the same day, or a reference for generating OpenAPI from Zod without keeping a second source of truth. Also useful as a teaching repo: the setup is written for someone who has never installed Docker.

## Limitations

- The notes module is a teaching example with no authorization. Do not store anything sensitive in it.
- List and update endpoints are deliberately missing, and the contract does not promise them.
- `/docs` loads Scalar from a CDN, so it needs network access. Telemetry and font loading are disabled.

## Commands

`pnpm dev`, `pnpm lint`, `pnpm check`, `pnpm test`, `pnpm build`, `pnpm verify`, `pnpm api:smoke`. The full table with explanations is in the Russian documentation.

## Documentation

[`docs/ru.md`](docs/ru.md) keeps the original walkthrough in Russian: installing Git and Docker from scratch, environment setup, Prisma tooling notes for AI agents and the team conventions. [`API_CONVENTIONS.md`](API_CONVENTIONS.md) explains how to add a module to the registry.

## Contributing

Branch, pull request, CI, review. Issue and PR templates live in `.github/`. New routes go through the module registry, never through `router.get`.

## License

MIT, see [LICENSE](LICENSE).
