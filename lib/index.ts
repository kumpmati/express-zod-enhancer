import { RequestHandler, Router } from "express"
import { EndpointBuilder } from "./endpoint"
import { validateBody, validateParams, validateQuery } from "./validate"
import { AppError } from "./error"

export class ApiBuilder {
  private router: Router
  private routes: EndpointBuilder[]

  constructor(router?: Router) {
    this.router = router ?? Router()
    this.routes = []
  }

  /**
   * Compiles all the routes in the builder and attaches them to the
   * app or router
   *
   * @returns this
   */
  public compile() {
    for (const route of this.routes) {
      const compiled = route.getRouteObject()

      const middleware: RequestHandler[] = []

      if (compiled.bodySchema) middleware.push(validateBody(compiled.bodySchema))
      if (compiled.querySchema) middleware.push(validateQuery(compiled.querySchema))

      this.router.all(compiled.path, ...middleware, (req, res, next) => {
        if (req.method.toLowerCase() !== compiled.method) {
          return next(new AppError(405, "method not allowed"))
        }

        return compiled.handler(req, res, next)
      })
    }

    return this.router
  }

  /**
   * Adds a new endpoint to the API
   * @returns
   */
  public endpoint<T extends string>(path: T) {
    const builder = new EndpointBuilder<T>(this, path)
    this.routes.push(builder)
    return builder
  }
}
