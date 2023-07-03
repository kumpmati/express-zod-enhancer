import { ZodObject, ZodRawShape, ZodSchema, z } from "zod"
import { ApiBuilder } from "."
import type { RequestHandler } from "express"
import type { RouteParameters } from "express-serve-static-core"

type RouteMethod = "get" | "post" | "patch" | "update" | "delete" | "options"

const routeMetaSchema = z.object({
  shortDescription: z.string(),
  description: z.string(),
})

export type RouteMetaSchema = z.infer<typeof routeMetaSchema>

const routeSchema = z.object({
  path: z.string(),
  method: z
    .literal("get")
    .or(z.literal("post"))
    .or(z.literal("patch"))
    .or(z.literal("update"))
    .or(z.literal("delete"))
    .or(z.literal("options")),

  meta: routeMetaSchema.optional(),
  bodySchema: z.any().optional(),
  querySchema: z.any().optional(),
  responseSchema: z.any().optional(),
  middleware: z.array(z.any()),
  handler: z.any(),
})

export type RouteSchema = z.infer<typeof routeSchema>

export class EndpointBuilder<
  Path extends string = any,
  Body extends Record<string, any> = any,
  Query extends Record<string, any> = any,
  Response = any
> {
  private api: ApiBuilder

  private _path: string
  private _method?: RouteMethod
  private _meta?: RouteMetaSchema
  private _bodySchema?: ZodSchema
  private _querySchema?: ZodSchema
  private _paramsSchema?: ZodSchema
  private _responseSchema?: ZodSchema
  private _middleware: RequestHandler[]
  private _handler?: RequestHandler<RouteParameters<Path>, any, Body, Query>

  constructor(api: ApiBuilder, path: Path) {
    this.api = api
    this._path = path
    this._middleware = []
  }

  public getRouteObject(): RouteSchema {
    if (!this._handler) throw new Error("a route must have a handler function")
    if (!this._method) throw new Error("a route must have a method")

    return {
      path: this._path,
      method: this._method,
      meta: this._meta,
      bodySchema: this._bodySchema,
      querySchema: this._querySchema,
      responseSchema: this._responseSchema,
      middleware: this._middleware,
      handler: this._handler,
    }
  }

  /**
   * Defines the method
   * @param val
   * @returns
   */
  public method(val: RouteMethod): Omit<typeof this, "method"> {
    if (this._method) throw new Error("an endpoint's method can only be defined once")

    this._method = val
    return this
  }

  /**
   * Attaches OpenAPI metadata to the route.
   *
   * @param val Metadata
   * @returns
   */
  public meta(val: RouteMetaSchema): Omit<typeof this, "meta"> {
    this._meta = val
    return this
  }

  /**
   * Defines the schema used to validate the request's body
   * @param schema Zod schema
   */
  public body<T extends ZodRawShape>(
    schema: ZodObject<T>
  ): EndpointBuilder<Path, z.infer<typeof schema>, Query> {
    this._bodySchema = schema
    return this as any
  }

  /**
   * Defines the schema used to validate the request's URL query params
   * @param schema Zod schema
   */
  public query<T extends ZodRawShape>(
    schema: ZodObject<T>
  ): EndpointBuilder<Path, Body, z.infer<typeof schema>> {
    this._querySchema = schema
    return this as any
  }

  /**
   * Defines the schema used to validate the response content sent
   * by the handler function
   * @param schema Zod schema
   */
  public response<T extends ZodRawShape>(
    schema: ZodSchema<T>
  ): EndpointBuilder<Path, Body, Query, z.infer<typeof schema>> {
    this._responseSchema = schema
    return this as any
  }

  /**
   * Attaches one or more middleware to the route
   * @param handler
   * @returns
   */
  public use(...handlers: RequestHandler[]): this {
    this._middleware.push(...handlers)
    return this
  }

  /**
   * Attaches a request handler to the route
   * @param handler
   * @returns
   */
  public handle(handler: RequestHandler<RouteParameters<Path>, Response, Body, Query>) {
    this._handler = handler
    return this
  }
}
