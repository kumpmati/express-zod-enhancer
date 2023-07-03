import { ApiBuilder } from "../../lib"
import { healthEndpoint } from "./health"
import { helloRouter } from "./name"

export const v1 = new ApiBuilder()

v1.endpoint("/", healthEndpoint)
v1.subRouter("/hello", helloRouter)
