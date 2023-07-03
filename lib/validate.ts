import { RequestHandler } from "express"
import { ZodSchema } from "zod"

export const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      console.log(result.error)
      return next(new Error("malformed"))
    }

    Object.assign(req.body, result.data)
    return next()
  }
}

export const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      console.log(result.error)
      return next(new Error("malformed"))
    }

    Object.assign(req.query, result.data)
    return next()
  }
}

export const validateParams = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      console.log(result.error)
      return next(new Error("malformed"))
    }

    Object.assign(req.params, result.data)
    return next()
  }
}
