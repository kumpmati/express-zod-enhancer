import type { RequestHandler } from "express"
import { z } from "zod"

export type EnhancedRequestHandler<
  Body extends Record<string, any> = Record<string, never>,
  Query extends Record<string, any> = Record<string, never>,
  ResBody = any,
  Params extends Record<string, any> = Record<string, never>
> = RequestHandler<Params, ResBody, Body, Query> & { __zod_api: RouteSchema }

export type EndpointMethod = "get" | "post" | "patch" | "put" | "update" | "delete" | "options"

export const routeMetaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  deprecated: z.boolean().optional(),
})

export type RouteMetaSchema = z.infer<typeof routeMetaSchema>

const routeSchema = z.object({
  meta: routeMetaSchema,
  bodySchema: z.any().optional(),
  paramsSchema: z.any().optional(),
  querySchema: z.any().optional(),
  responseSchema: z.any().optional(),
  middleware: z.array(z.any()),
})

export type RouteSchema = z.infer<typeof routeSchema>
