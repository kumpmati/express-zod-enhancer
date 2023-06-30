# express-ts-boilerplate

This boilerplate contains the following things already set up:

- basic express server
- central error handler
- middleware to validate body and query (using Zod)
- CORS (only allows `localhost:3000`!)
- api router (mounted at `/api/v1`)
- custom AppError class
- central environment variables configuration (validated using Zod)
- testing framework (vitest)
- prettier
- eslint
- logger (using pino + pino-pretty)
