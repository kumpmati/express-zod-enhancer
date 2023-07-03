import { RequestHandler } from "express"
import { ZodSchema } from "zod"
import { AppError } from "../helpers/appError"

/**
 * Middleware to validate request body using a Zod schema.
 *
 * @param schema
 * @returns
 */
export const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(new AppError(400, "malformed"))
    }

    Object.assign(req.body, result.data)
    return next()
  }
}

/**
 * Middleware to validate request query using a Zod schema.
 *
 * @param schema
 * @returns
 */
export const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return next(new AppError(400, "malformed"))
    }

    Object.assign(req.query, result.data)
    return next()
  }
}

/**
 * Middleware to validate request path's params using a Zod schema.
 *
 * @param schema
 * @returns
 */
export const validateParams = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
      return next(new AppError(400, "malformed"))
    }

    Object.assign(req.params, result.data)
    return next()
  }
}
