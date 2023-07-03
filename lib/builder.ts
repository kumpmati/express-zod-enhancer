import { ZodObject, ZodRawShape, ZodSchema, z } from "zod"
import type { RequestHandler } from "express"
import type { RouteParameters } from "express-serve-static-core"
import { validateBody, validateParams, validateQuery } from "./middleware/validate"
import { EnhancedRequestHandler, RouteMetaSchema, RouteSchema } from "./types"

/**
 * Helper class to build a typesafe API endpoint.
 */
export class EndpointBuilder<
  Path extends string = any,
  ReqBody extends Record<string, any> = Record<string, never>,
  Query extends Record<string, any> = Record<string, never>,
  ResBody = any,
  Params extends Record<string, any> = Record<string, never>
> {
  // private _method?: EndpointMethod
  private _meta?: RouteMetaSchema
  private _bodySchema?: ZodSchema
  private _paramsSchema?: ZodSchema
  private _querySchema?: ZodSchema
  private _responseSchema?: ZodSchema
  private _middleware: RequestHandler[]
  private _handler?: RequestHandler<Params, ResBody, ReqBody, Query>

  constructor() {
    this._middleware = []
  }

  /**
   * Returns the final route object used when attaching to the ApiBuilder.
   *
   * You don't need to call this function, that is done automatically by the ApiBuilder.
   */
  public build(): EnhancedRequestHandler<ReqBody, Query, ResBody, Params> {
    if (!this._handler) throw new Error("a route must have a handler function: ")
    if (!this._meta) throw new Error("a route must have meta info")

    const middleware: RequestHandler[] = []

    if (this._bodySchema) middleware.push(validateBody(this._bodySchema))
    if (this._querySchema) middleware.push(validateQuery(this._querySchema))
    if (this._paramsSchema) middleware.push(validateParams(this._paramsSchema))

    // add custom middleware after body and query middleware
    middleware.push(...this._middleware)

    const info: RouteSchema = {
      meta: this._meta,
      bodySchema: this._bodySchema,
      querySchema: this._querySchema,
      paramsSchema: this._paramsSchema,
      responseSchema: this._responseSchema, // TODO: not used right now, implement validation
      middleware: middleware,
    }

    const handler = this._handler as EnhancedRequestHandler<ReqBody, Query, ResBody, Params>

    // save the info into the request handler
    handler.__zod_api = info

    return handler
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
  ): Omit<EndpointBuilder<Path, z.infer<typeof schema>, Query, ResBody, Params>, "body"> {
    this._bodySchema = schema
    return this as any
  }

  /**
   * Defines the schema used to validate the request's URL query params
   * @param schema Zod schema
   */
  public query<T extends ZodRawShape>(
    schema: ZodObject<T>
  ): Omit<EndpointBuilder<Path, ReqBody, z.infer<typeof schema>, ResBody, Params>, "query"> {
    this._querySchema = schema
    return this as any
  }

  /**
   * Defines the schema used to validate the request's route params
   * @param schema Zod schema
   */
  public params<T extends RouteParameters<Path>>(
    schema: ZodSchema<T>
  ): Omit<
    EndpointBuilder<
      Path,
      ReqBody,
      Query,
      ResBody,
      z.infer<typeof schema> extends RouteParameters<Path>
        ? z.infer<typeof schema>
        : Record<string, never>
    >,
    "params"
  > {
    this._paramsSchema = schema
    return this as any
  }

  /**
   * Defines the schema used to validate the response content sent
   * by the handler function
   * @param schema Zod schema
   */
  public response<T>(
    schema: ZodSchema<T>
  ): Omit<EndpointBuilder<Path, ReqBody, Query, z.infer<typeof schema>, Params>, "response"> {
    this._responseSchema = schema
    return this as any
  }

  /**
   * Attaches one or more middleware to the route
   * @param handler
   * @returns
   */
  public use(...handlers: RequestHandler[]): Omit<typeof this, "use"> {
    this._middleware.push(...handlers)
    return this
  }

  /**
   * Attaches a request handler to the route
   * @param handler
   * @returns
   */
  public handle(
    handler: RequestHandler<Params, ResBody, ReqBody, Query>
  ): Omit<typeof this, "handle"> {
    this._handler = handler
    return this
  }
}

export const endpoint = <T extends string = "/">() => {
  return new EndpointBuilder<T>()
}
