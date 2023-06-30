import { AppError } from "../utils/AppError"
import { RequestHandler } from "express"
import { ZodSchema } from "zod"

export const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler => {
  return async (req, _, next) => {
    const result = await schema.spa(req.query)

    if (!result.success) {
      return next(new AppError(400, "invalid query"))
    }

    Object.assign(req.query, result.data)
    next()
  }
}
