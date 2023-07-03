import { type Express } from "express"
import { EnhancedRequestHandler, EndpointMethod, RouteSchema } from "../types"

const MAX_FLATTEN_DEPTH = 10

const isEnhancedRoute = (item: any) => !!item?.handle?.__zod_api
const getInfo = (item: any) => item.handle.__zod_api

// 'split' and 'print' copied and slightly modified from stack overflow to traverse the express routes.
// source: https://stackoverflow.com/a/46397967

const split = (thing: any) => {
  if (typeof thing === "string") {
    return thing.split("/")
  } else if (thing.fast_slash) {
    return ""
  } else {
    const match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">"
  }
}

export const print = (path: any, layer: any): RouteInfo | null => {
  if (layer.route) {
    return layer.route.stack.map(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === "router" && layer.handle.stack) {
    return layer.handle.stack.map(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method && isEnhancedRoute(layer)) {
    return {
      method: layer.method,
      path: path.concat(split(layer.regexp)).filter(Boolean).join("/"),
      handle: layer.handle,
      info: getInfo(layer),
    }
  }

  return null
}

export type RouteInfo = {
  method: EndpointMethod
  path: string
  handle: EnhancedRequestHandler
  info: RouteSchema
}

export const listAllRoutes = (app: Express): RouteInfo[] => {
  return app._router.stack
    .map(print.bind(null, []))
    .flat(MAX_FLATTEN_DEPTH)
    .filter((val: any) => !!val)
}
