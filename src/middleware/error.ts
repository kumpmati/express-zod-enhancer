import { AppError } from "../utils/AppError"
import { ErrorRequestHandler } from "express"
import { logger } from "../utils/logger"

/**
 * Handles all errors thrown within the application.
 */
export const handleAppError: ErrorRequestHandler = async (err, req, res, next) => {
  logger.error(err)

  if (!err) return next()

  if (err instanceof AppError) {
    if (!err.isOperational) {
      process.exit(1)
    }

    return res
      .status(err.statusCode)
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify({ error: err.message }))
  }

  return res
    .status(500)
    .setHeader("Content-Type", "application/json")
    .end(JSON.stringify({ error: err.message ?? err }))
}
