import { AppError } from "../utils/AppError"
import { RequestHandler } from "express"
import { ZodSchema } from "zod"

export const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
  return async (req, _, next) => {
    const result = await schema.spa(req.body)

    if (!result.success) {
      return next(new AppError(400, "malformed"))
    }

    Object.assign(req.body, result.data)
    next()
  }
}
