import { RequestHandler, Router } from "express"
import { EndpointBuilder, RouteMethod } from "./endpoint"
import { validateBody, validateQuery } from "./validate"
import { AppError } from "./error"

/**
 * Api Builder class.
 */
export class ApiBuilder {
  /**
   * Express router.
   */
  private _router: Router

  private endpoints: { path: string; builder: EndpointBuilder }[]

  constructor(router?: Router) {
    this._router = router ?? Router()
    this.endpoints = []
  }

  /**
   * Compiles all the routes in the builder and attaches them to the
   * app or router.
   *
   * **Call this when you attach the ApiBuilder to your express app!**
   *
   * @returns this
   */
  public compile() {
    for (const endpoint of this.endpoints) {
      const compiled = endpoint.builder.getRouteObject()

      const middleware: RequestHandler[] = []

      if (compiled.bodySchema) middleware.push(validateBody(compiled.bodySchema))
      if (compiled.querySchema) middleware.push(validateQuery(compiled.querySchema))

      this._router.all(endpoint.path, ...middleware, (req, res, next) => {
        if (req.method.toLowerCase() !== compiled.method) {
          return next(new AppError(405, "method not allowed"))
        }

        return compiled.handler(req, res, next)
      })
    }

    return this._router
  }

  /**
   * Attaches a new endpoint to the ApiBuilder
   * @param builder
   */
  public endpoint<T extends string>(path: T, builder: EndpointBuilder<T>) {
    this.endpoints.push({ path, builder })
    return this
  }

  /**
   * Adds a subrouter to the current API. This works like normal express routers,
   * where you can group endpoints into a router and attach the router in one place.
   * @param path
   * @param subRouter
   * @returns
   */
  public subRouter<T extends string>(path: T, subRouter: ApiBuilder) {
    this._router.use(path, subRouter.compile())
    return this
  }

  /**
   * Returns an EndpointBuilder that is automatically attached to the current
   * ApiBuilder in the given path.
   */
  private _buildEndpoint<T extends string>(path: T, method: RouteMethod) {
    const builder = new EndpointBuilder<T>()

    this.endpoints.push({ path, builder })
    return builder.method(method)
  }

  public get<T extends string>(path: T) {
    return this._buildEndpoint(path, "get")
  }
  public post<T extends string>(path: T) {
    return this._buildEndpoint(path, "post")
  }
  public patch<T extends string>(path: T) {
    return this._buildEndpoint(path, "patch")
  }
  public put<T extends string>(path: T) {
    return this._buildEndpoint(path, "put")
  }
  public delete<T extends string>(path: T) {
    return this._buildEndpoint(path, "delete")
  }
  public options<T extends string>(path: T) {
    return this._buildEndpoint(path, "options")
  }
}
